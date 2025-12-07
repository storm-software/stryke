import { createHash } from "node:crypto";
import { CapnpRPC } from "../src/rpc";
import { Hash, HashFactory } from "./schemas/hash-factory";
import { SimpleInterface } from "./schemas/simple-interface";

// describe('Workspaces', () => {
//   let fs: TempFs;
//   beforeEach(() => {
//     fs = new TempFs('Workspaces');
//   });
//   afterEach(() => {
//     fs.cleanup();
//   });

//   describe('to project name', () => {
//     it('should lowercase names', () => {
//       const appResults = toProjectName('my-apps/directory/my-app/package.json');
//       const libResults = toProjectName('packages/directory/MyLib/package.json');
//       expect(appResults).toEqual('my-app');
//       expect(libResults).toEqual('mylib');
//     });

//     it('should use the workspace globs in package.json', async () => {
//       await fs.createFiles({
//         'packages/my-package/package.json': JSON.stringify({
//           name: 'my-package',
//           description: 'my-package description',
//         }),
//         'package.json': JSON.stringify({
//           name: 'package-name',
//           description: 'package description',
//           workspaces: ['packages/**'],
//         }),
//       });

//       const { projects } = await withEnvironmentVariables(
//         {
//           NX_WORKSPACE_ROOT_PATH: fs.tempDir,
//         },
//         async () => {
//           const plugins = await getPlugins(fs.tempDir);
//           const res = await retrieveProjectConfigurations(
//             plugins,
//             fs.tempDir,
//             readNxJson(fs.tempDir)
//           );
//           cleanupPlugins();
//           return res;
//         }
//       );
//       expect(projects['packages/my-package']).toMatchInlineSnapshot(`
//         {
//           "metadata": {
//             "description": "my-package description",
//             "js": {
//               "isInPackageManagerWorkspaces": true,
//               "packageName": "my-package",
//             },
//             "targetGroups": {},
//           },
//           "name": "my-package",
//           "root": "packages/my-package",
//           "tags": [
//             "npm:public",
//           ],
//           "targets": {
//             "nx-release-publish": {
//               "configurations": {},
//               "dependsOn": [
//                 "^nx-release-publish",
//               ],
//               "executor": "@nx/js:release-publish",
//               "options": {},
//               "parallelism": true,
//             },
//           },
//         }
//       `);
//     }, 50000);
//   });
// });

describe("rpc", () => {
  let rpc: CapnpRPC;

  beforeEach(() => {
    rpc = new CapnpRPC();
  });

  afterEach(() => {
    rpc.close();
  });

  it("SimpleInterface", async () => {
    const server = async () => {
      const s = await rpc.accept();
      s.initMain(SimpleInterface, {
        subtract: async (p, r) => {
          r.result = p.a - p.b;
        }
      });
      return s;
    };

    const client = async () => {
      const res = await rpc
        .connect()
        .bootstrap(SimpleInterface)
        .subtract(p => {
          p.a = 9;
          p.b = -1;
        })
        .promise();
      return res.result;
    };

    const [, result] = await Promise.all([server(), client()]);
    expect(result).toBe(10);
  }, 1000);

  it("HashFactory", async () => {
    const server = async () => {
      const s = await rpc.accept();
      s.initMain(HashFactory, {
        newSha1: async (_, r) => {
          const hash = createHash("sha1");
          const hs = new Hash.Server({
            async sum(_, r) {
              const digest = hash.digest();
              return r._initHash(digest.length).copyBuffer(digest);
            },

            write: p =>
              new Promise((resolve, reject) =>
                hash.write(p.data.toUint8Array(), undefined, err =>
                  err ? reject(err) : resolve()
                )
              )
          });
          r.hash = hs.client();
        }
      });
      return s;
    };

    const client = async () => {
      const hash = rpc.connect().bootstrap(HashFactory).newSha1().getHash();
      hash.write(p => {
        const buf = encodeUtf8("hello ");
        p._initData(buf.byteLength).copyBuffer(buf);
      });
      hash.write(p => {
        const buf = encodeUtf8("world");
        p._initData(buf.byteLength).copyBuffer(buf);
      });
      const sum = await hash.sum().promise();
      return sum.hash.toUint8Array();
    };

    const [, result] = await Promise.all([server(), client()]);
    expect(
      // @ts-expect-error
      bufferToHex(result)
    ).toBe("[2a ae 6c 35 c9 4f cf b4 15 db e9 5f 40 8b 9c e9 1e e8 46 ed]");
  }, 1000);
});
