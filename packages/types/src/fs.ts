/* -------------------------------------------------------------------

                       🗲 Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/stryke.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/stryke
 Documentation:            https://docs.stormsoftware.com/projects/stryke
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import type { Abortable } from "node:events";
import type {
  BigIntStats,
  BigIntStatsFs,
  BigIntStatsListener,
  BufferEncodingOption,
  CopyOptions,
  CopySyncOptions,
  Dir,
  Dirent,
  EncodingOption,
  FSWatcher,
  GlobOptions,
  GlobOptionsWithFileTypes,
  GlobOptionsWithoutFileTypes,
  MakeDirectoryOptions,
  Mode,
  NoParamCallback,
  ObjectEncodingOptions,
  OpenAsBlobOptions,
  OpenDirOptions,
  OpenMode,
  PathLike,
  PathOrFileDescriptor,
  ReadOptions,
  ReadOptionsWithBuffer,
  ReadPosition,
  ReadStream,
  RmDirOptions,
  RmOptions,
  StatFsOptions,
  StatOptions,
  StatSyncOptions,
  StatWatcher,
  Stats,
  StatsFs,
  StatsListener,
  TimeLike,
  WatchFileOptions,
  WatchListener,
  WatchOptions,
  WatchOptionsWithBufferEncoding,
  WatchOptionsWithStringEncoding,
  WriteFileOptions,
  WriteOptions,
  WriteStream
} from "node:fs";
import type {
  DisposableTempDir,
  FileChangeInfo,
  FileHandle,
  FlagAndOpenMode
} from "node:fs/promises";
import type { Stream } from "node:stream";

/**
 * An interface describing the exports of the Node.js promise-based [`node:fs/promises`](https://nodejs.org/api/fs.html#promises-api) module.
 *
 * @remarks
 * This interface mirrors the shape of the built-in `node:fs/promises` module so that promise-based file system implementations can be swapped in where needed.
 *
 * @see https://nodejs.org/api/fs.html#promises-api
 */
export interface PromisesFileSystemInterface {
  /**
   * Tests a user's permissions for the file or directory specified by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesaccesspath-mode
   */
  access: (path: PathLike, mode?: number | undefined) => Promise<void>;

  /**
   * Asynchronously appends data to a file, creating the file if it does not yet exist.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesappendfilepath-data-options
   */
  appendFile: (
    path: PathLike | FileHandle,
    data: string | Uint8Array<ArrayBufferLike>,
    options?:
      | (ObjectEncodingOptions &
          FlagAndOpenMode & {
            flush?: boolean | undefined;
          })
      | BufferEncoding
      | null
      | undefined
  ) => Promise<void>;

  /**
   * Asynchronously changes the permissions of a file.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseschmodpath-mode
   */
  chmod: (path: PathLike, mode: Mode) => Promise<void>;

  /**
   * Asynchronously changes owner and group of a file.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseschownpath-uid-gid
   */
  chown: (path: PathLike, uid: number, gid: number) => Promise<void>;

  /**
   * Asynchronously copies `src` to `dest`.
   *
   * @see https://nodejs.org/api/fs.html#fspromisescopyfilesrc-dest-mode
   */
  copyFile: (
    src: PathLike,
    dest: PathLike,
    mode?: number | undefined
  ) => Promise<void>;

  /**
   * Asynchronously copies directory structures and files.
   *
   * @see https://nodejs.org/api/fs.html#fspromisescpsrc-dest-options
   */
  cp: (
    source: string | URL,
    destination: string | URL,
    opts?: CopyOptions | undefined
  ) => Promise<void>;

  /**
   * Asynchronously expands glob patterns and yields matching entries.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesglobpattern-options
   */
  glob:
    | ((pattern: string | readonly string[]) => AsyncIterator<string>)
    | ((
        pattern: string | readonly string[],
        options: GlobOptionsWithFileTypes
      ) => AsyncIterator<Dirent<string>>)
    | ((
        pattern: string | readonly string[],
        options: GlobOptionsWithoutFileTypes
      ) => AsyncIterator<string>)
    | ((
        pattern: string | readonly string[],
        options: GlobOptions
      ) => AsyncIterator<string | Dirent<string>>);

  /**
   * Changes the permissions on a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseslchmodpath-mode
   */
  lchmod: (path: PathLike, mode: Mode) => Promise<void>;

  /**
   * Changes owner and group on a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseslchownpath-uid-gid
   */
  lchown: (path: PathLike, uid: number, gid: number) => Promise<void>;

  /**
   * Changes access and modification times on a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseslutimespath-atime-mtime
   */
  lutimes: (path: PathLike, atime: TimeLike, mtime: TimeLike) => Promise<void>;

  /**
   * Creates a new hard link.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseslinkexistingpath-newpath
   */
  link: (existingPath: PathLike, newPath: PathLike) => Promise<void>;

  /**
   * Retrieves stats for a symbolic link path.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseslstatpath-options
   */
  lstat:
    | ((
        path: PathLike,
        opts?: (StatOptions & { bigint?: false | undefined }) | undefined
      ) => Promise<Stats>)
    | ((
        path: PathLike,
        opts: StatOptions & { bigint: true }
      ) => Promise<BigIntStats>)
    | ((
        path: PathLike,
        opts?: StatOptions | undefined
      ) => Promise<Stats | BigIntStats>);

  /**
   * Asynchronously creates a directory.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesmkdirpath-options
   */
  mkdir:
    | ((
        path: PathLike,
        options: MakeDirectoryOptions & { recursive: true }
      ) => Promise<string | undefined>)
    | ((
        path: PathLike,
        options?:
          | Mode
          | (MakeDirectoryOptions & { recursive?: false | undefined })
          | null
          | undefined
      ) => Promise<void>)
    | ((
        path: PathLike,
        options?: Mode | MakeDirectoryOptions | null | undefined
      ) => Promise<string | undefined>);

  /**
   * Creates a unique temporary directory.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesmkdtempprefix-options
   */
  mkdtemp:
    | ((
        prefix: string,
        options?: ObjectEncodingOptions | BufferEncoding | null | undefined
      ) => Promise<string>)
    | ((
        prefix: string,
        options: BufferEncodingOption
      ) => Promise<NonSharedBuffer>)
    | ((
        prefix: string,
        options?: ObjectEncodingOptions | BufferEncoding | null | undefined
      ) => Promise<string | NonSharedBuffer>);

  /**
   * Creates a unique async-disposable temporary directory.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesmkdtempdisposableprefix-options
   */
  mkdtempDisposable: (
    prefix: PathLike,
    options?: EncodingOption
  ) => Promise<DisposableTempDir>;

  /**
   * Opens a file and returns a file handle.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesopenpath-flags-mode
   */
  open: (
    path: PathLike,
    flags?: string | number | undefined,
    mode?: Mode | undefined
  ) => Promise<FileHandle>;

  /**
   * Opens a directory for async iteration.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesopendirpath-options
   */
  opendir: (
    path: PathLike,
    options?: OpenDirOptions | undefined
  ) => Promise<Dir>;

  /**
   * Reads directory entries.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesreaddirpath-options
   */
  readdir:
    | ((
        path: PathLike,
        options?:
          | BufferEncoding
          | (ObjectEncodingOptions & {
              withFileTypes?: false | undefined;
              recursive?: boolean | undefined;
            })
          | null
          | undefined
      ) => Promise<string[]>)
    | ((
        path: PathLike,
        options:
          | "buffer"
          | {
              encoding: "buffer";
              withFileTypes?: false | undefined;
              recursive?: boolean | undefined;
            }
      ) => Promise<NonSharedBuffer[]>)
    | ((
        path: PathLike,
        options?:
          | BufferEncoding
          | (ObjectEncodingOptions & {
              withFileTypes?: false | undefined;
              recursive?: boolean | undefined;
            })
          | null
          | undefined
      ) => Promise<string[] | NonSharedBuffer[]>)
    | ((
        path: PathLike,
        options: ObjectEncodingOptions & {
          withFileTypes: true;
          recursive?: boolean | undefined;
        }
      ) => Promise<Dirent<string>[]>)
    | ((
        path: PathLike,
        options: {
          encoding: "buffer";
          withFileTypes: true;
          recursive?: boolean | undefined;
        }
      ) => Promise<Dirent<NonSharedBuffer>[]>);

  /**
   * Reads the entire contents of a file.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesreadfilepath-options
   */
  readFile:
    | ((
        path: PathLike | FileHandle,
        options?:
          | ({
              encoding?: null | undefined;
              flag?: OpenMode | undefined;
            } & Abortable)
          | null
          | undefined
      ) => Promise<NonSharedBuffer>)
    | ((
        path: PathLike | FileHandle,
        options:
          | BufferEncoding
          | ({
              encoding: BufferEncoding;
              flag?: OpenMode | undefined;
            } & Abortable)
      ) => Promise<string>)
    | ((
        path: PathLike | FileHandle,
        options?:
          | BufferEncoding
          | (ObjectEncodingOptions &
              Abortable & {
                flag?: OpenMode | undefined;
              })
          | null
          | undefined
      ) => Promise<string | NonSharedBuffer>);

  /**
   * Reads the value of a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesreadlinkpath-options
   */
  readlink:
    | ((
        path: PathLike,
        options?: ObjectEncodingOptions | BufferEncoding | null | undefined
      ) => Promise<string>)
    | ((
        path: PathLike,
        options: BufferEncodingOption
      ) => Promise<NonSharedBuffer>)
    | ((
        path: PathLike,
        options?: string | ObjectEncodingOptions | null | undefined
      ) => Promise<string | NonSharedBuffer>);

  /**
   * Resolves a path to its canonical absolute path.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesrealpathpath-options
   */
  realpath:
    | ((
        path: PathLike,
        options?: ObjectEncodingOptions | BufferEncoding | null | undefined
      ) => Promise<string>)
    | ((
        path: PathLike,
        options: BufferEncodingOption
      ) => Promise<NonSharedBuffer>)
    | ((
        path: PathLike,
        options?: ObjectEncodingOptions | BufferEncoding | null | undefined
      ) => Promise<string | NonSharedBuffer>);

  /**
   * Renames a file or directory.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesrenameoldpath-newpath
   */
  rename: (oldPath: PathLike, newPath: PathLike) => Promise<void>;

  /**
   * Removes files and directories.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesrmpath-options
   */
  rm: (path: PathLike, options?: RmOptions | undefined) => Promise<void>;

  /**
   * Removes a directory.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesrmdirpath-options
   */
  rmdir: (path: PathLike, options?: RmDirOptions | undefined) => Promise<void>;

  /**
   * Retrieves stats for a path.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesstatpath-options
   */
  stat:
    | ((
        path: PathLike,
        opts?: (StatOptions & { bigint?: false | undefined }) | undefined
      ) => Promise<Stats>)
    | ((
        path: PathLike,
        opts: StatOptions & { bigint: true }
      ) => Promise<BigIntStats>)
    | ((
        path: PathLike,
        opts?: StatOptions | undefined
      ) => Promise<Stats | BigIntStats>);

  /**
   * Retrieves filesystem stats for a path.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesstatfspath-options
   */
  statfs:
    | ((
        path: PathLike,
        opts?: (StatFsOptions & { bigint?: false | undefined }) | undefined
      ) => Promise<StatsFs>)
    | ((
        path: PathLike,
        opts: StatFsOptions & { bigint: true }
      ) => Promise<BigIntStatsFs>)
    | ((
        path: PathLike,
        opts?: StatFsOptions | undefined
      ) => Promise<StatsFs | BigIntStatsFs>);

  /**
   * Creates a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fspromisessymlinktarget-path-type
   */
  symlink: (
    target: PathLike,
    path: PathLike,
    type?: string | null | undefined
  ) => Promise<void>;

  /**
   * Truncates a file to the specified length.
   *
   * @see https://nodejs.org/api/fs.html#fspromisestruncatepath-len
   */
  truncate: (path: PathLike, len?: number | undefined) => Promise<void>;

  /**
   * Removes a file or symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesunlinkpath
   */
  unlink: (path: PathLike) => Promise<void>;

  /**
   * Changes access and modification times of a file.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesutimespath-atime-mtime
   */
  utimes: (path: PathLike, atime: TimeLike, mtime: TimeLike) => Promise<void>;

  /**
   * Watches for filesystem changes and yields events.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseswatchfilename-options
   */
  watch:
    | ((
        filename: PathLike,
        options?: BufferEncoding | WatchOptionsWithStringEncoding | undefined
      ) => AsyncIterator<FileChangeInfo<string>>)
    | ((
        filename: PathLike,
        options: "buffer" | WatchOptionsWithBufferEncoding
      ) => AsyncIterator<FileChangeInfo<NonSharedBuffer>>)
    | ((
        filename: PathLike,
        options: BufferEncoding | "buffer" | WatchOptions
      ) => AsyncIterator<FileChangeInfo<string | NonSharedBuffer>>);

  /**
   * Asynchronously writes data to a file.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options
   */
  writeFile: (
    file: PathLike | FileHandle,
    data:
      | string
      | ArrayBufferView<ArrayBufferLike>
      | Iterable<string | ArrayBufferView<ArrayBufferLike>>
      | AsyncIterable<string | ArrayBufferView<ArrayBufferLike>>
      | Stream,
    options?:
      | BufferEncoding
      | (ObjectEncodingOptions & {
          mode?: Mode | undefined;
          flag?: OpenMode | undefined;
          flush?: boolean | undefined;
        } & Abortable)
      | null
      | undefined
  ) => Promise<void>;
}

/**
 * An interface describing the base/synchronous exports of the Node.js [`node:fs`](https://nodejs.org/api/fs.html) module.
 *
 * @remarks
 * This interface mirrors the shape of the built-in `node:fs` module so that a custom file system implementation (for example, an in-memory, virtual, or remote file system) can be provided anywhere a real file system is expected. Each member is typed against its corresponding `node:fs` export, which preserves all of the original call signatures and overloads.
 *
 * @see https://nodejs.org/api/fs.html
 */
export interface BaseFileSystemInterface {
  // ---------------------------------------------------------------------------
  // Callback API
  // ---------------------------------------------------------------------------

  /**
   * Tests a user's permissions for the file or directory specified by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsaccesspath-mode-callback
   */
  access:
    | ((
        path: PathLike,
        mode: number | undefined,
        callback: NoParamCallback
      ) => void)
    | ((path: PathLike, callback: NoParamCallback) => void);

  /**
   * Asynchronously append data to a file, creating the file if it does not yet exist.
   *
   * @see https://nodejs.org/api/fs.html#fsappendfilepath-data-options-callback
   */
  appendFile:
    | ((
        path: PathOrFileDescriptor,
        data: string | Uint8Array<ArrayBufferLike>,
        options: WriteFileOptions,
        callback: NoParamCallback
      ) => void)
    | ((
        file: PathOrFileDescriptor,
        data: string | Uint8Array<ArrayBufferLike>,
        callback: NoParamCallback
      ) => void);

  /**
   * Asynchronously changes the permissions of a file.
   *
   * @see https://nodejs.org/api/fs.html#fschmodpath-mode-callback
   */
  chmod: (path: PathLike, mode: Mode, callback: NoParamCallback) => void;

  /**
   * Asynchronously changes the owner and group of a file.
   *
   * @see https://nodejs.org/api/fs.html#fschownpath-uid-gid-callback
   */
  chown: (
    path: PathLike,
    uid: number,
    gid: number,
    callback: NoParamCallback
  ) => void;

  /**
   * Closes the file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsclosefd-callback
   */
  close: (fd: number, callback?: NoParamCallback | undefined) => void;

  /**
   * Asynchronously copies `src` to `dest`, overwriting `dest` by default if it already exists.
   *
   * @see https://nodejs.org/api/fs.html#fscopyfilesrc-dest-mode-callback
   */
  copyFile:
    | ((src: PathLike, dest: PathLike, callback: NoParamCallback) => void)
    | ((
        src: PathLike,
        dest: PathLike,
        mode: number,
        callback: NoParamCallback
      ) => void);

  /**
   * Asynchronously copies the entire directory structure from `src` to `dest`, including subdirectories and files.
   *
   * @see https://nodejs.org/api/fs.html#fscpsrc-dest-options-callback
   */
  cp:
    | ((
        source: string | URL,
        destination: string | URL,
        callback: (err: NodeJS.ErrnoException | null) => void
      ) => void)
    | ((
        source: string | URL,
        destination: string | URL,
        opts: CopyOptions,
        callback: (err: NodeJS.ErrnoException | null) => void
      ) => void);

  /**
   * Returns a new {@link https://nodejs.org/api/fs.html#class-fsreadstream | `fs.ReadStream`} object.
   *
   * @see https://nodejs.org/api/fs.html#fscreatereadstreampath-options
   */
  createReadStream: (
    path: PathLike,
    options?: BufferEncoding | undefined
  ) => ReadStream;

  /**
   * Returns a new {@link https://nodejs.org/api/fs.html#class-fswritestream | `fs.WriteStream`} object.
   *
   * @see https://nodejs.org/api/fs.html#fscreatewritestreampath-options
   */
  createWriteStream: (
    path: PathLike,
    options?: BufferEncoding | undefined
  ) => WriteStream;

  /**
   * Tests whether or not the given path exists by checking with the file system.
   *
   * @deprecated Use {@link FileSystemInterface.access | `access`} or {@link FileSystemInterface.stat | `stat`} instead.
   * @see https://nodejs.org/api/fs.html#fsexistspath-callback
   */
  exists: (path: PathLike, callback: (exists: boolean) => void) => void;

  /**
   * Sets the permissions on the file referenced by the supplied file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsfchmodfd-mode-callback
   */
  fchmod: (fd: number, mode: Mode, callback: NoParamCallback) => void;

  /**
   * Sets the owner of the file referenced by the supplied file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsfchownfd-uid-gid-callback
   */
  fchown: (
    fd: number,
    uid: number,
    gid: number,
    callback: NoParamCallback
  ) => void;

  /**
   * Forces all currently queued I/O operations associated with the file to the operating system's synchronized I/O completion state.
   *
   * @see https://nodejs.org/api/fs.html#fsfdatasyncfd-callback
   */
  fdatasync: (fd: number, callback: NoParamCallback) => void;

  /**
   * Invokes the callback with the {@link https://nodejs.org/api/fs.html#class-fsstats | `fs.Stats`} for the file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsfstatfd-options-callback
   */
  fstat:
    | ((
        fd: number,
        callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void
      ) => void)
    | ((
        fd: number,
        options: (StatOptions & { bigint?: false | undefined }) | undefined,
        callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void
      ) => void)
    | ((
        fd: number,
        options: StatOptions & { bigint: true },
        callback: (
          err: NodeJS.ErrnoException | null,
          stats: BigIntStats
        ) => void
      ) => void)
    | ((
        fd: number,
        options: StatOptions | undefined,
        callback: (
          err: NodeJS.ErrnoException | null,
          stats: Stats | BigIntStats
        ) => void
      ) => void);

  /**
   * Requests that all data for the open file descriptor is flushed to the storage device.
   *
   * @see https://nodejs.org/api/fs.html#fsfsyncfd-callback
   */
  fsync: (fd: number, callback: NoParamCallback) => void;

  /**
   * Truncates the file descriptor to the supplied length.
   *
   * @see https://nodejs.org/api/fs.html#fsftruncatefd-len-callback
   */
  ftruncate:
    | ((fd: number, len: number | undefined, callback: NoParamCallback) => void)
    | ((fd: number, callback: NoParamCallback) => void);

  /**
   * Changes the file system timestamps of the object referenced by the supplied file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsfutimesfd-atime-mtime-callback
   */
  futimes: (
    fd: number,
    atime: TimeLike,
    mtime: TimeLike,
    callback: NoParamCallback
  ) => void;

  /**
   * Retrieves the files matching the specified glob pattern.
   *
   * @see https://nodejs.org/api/fs.html#fsglobpattern-options-callback
   */
  glob:
    | ((
        pattern: string | readonly string[],
        callback: (err: NodeJS.ErrnoException | null, matches: string[]) => void
      ) => void)
    | ((
        pattern: string | readonly string[],
        options: GlobOptionsWithFileTypes,
        callback: (
          err: NodeJS.ErrnoException | null,
          matches: Dirent<string>[]
        ) => void
      ) => void)
    | ((
        pattern: string | readonly string[],
        options: GlobOptionsWithoutFileTypes,
        callback: (err: NodeJS.ErrnoException | null, matches: string[]) => void
      ) => void)
    | ((
        pattern: string | readonly string[],
        options: GlobOptions,
        callback: (
          err: NodeJS.ErrnoException | null,
          matches: string[] | Dirent<string>[]
        ) => void
      ) => void);

  /**
   * Changes the permissions on a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fslchmodpath-mode-callback
   */
  lchmod: (path: PathLike, mode: Mode, callback: NoParamCallback) => void;

  /**
   * Sets the owner of the symbolic link path.
   *
   * @see https://nodejs.org/api/fs.html#fslchownpath-uid-gid-callback
   */
  lchown: (
    path: PathLike,
    uid: number,
    gid: number,
    callback: NoParamCallback
  ) => void;

  /**
   * Changes the access and modification times of a symbolic link without dereferencing it.
   *
   * @see https://nodejs.org/api/fs.html#fslutimespath-atime-mtime-callback
   */
  lutimes: (
    path: PathLike,
    atime: TimeLike,
    mtime: TimeLike,
    callback: NoParamCallback
  ) => void;

  /**
   * Creates a new hard link from `existingPath` to `newPath`.
   *
   * @see https://nodejs.org/api/fs.html#fslinkexistingpath-newpath-callback
   */
  link: (
    existingPath: PathLike,
    newPath: PathLike,
    callback: NoParamCallback
  ) => void;

  /**
   * Retrieves the {@link https://nodejs.org/api/fs.html#class-fsstats | `fs.Stats`} for the symbolic link referred to by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fslstatpath-options-callback
   */
  lstat:
    | ((
        path: PathLike,
        callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void
      ) => void)
    | ((
        path: PathLike,
        options: (StatOptions & { bigint?: false | undefined }) | undefined,
        callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void
      ) => void)
    | ((
        path: PathLike,
        options: StatOptions & { bigint: true },
        callback: (
          err: NodeJS.ErrnoException | null,
          stats: BigIntStats
        ) => void
      ) => void)
    | ((
        path: PathLike,
        options: StatOptions | undefined,
        callback: (
          err: NodeJS.ErrnoException | null,
          stats: Stats | BigIntStats
        ) => void
      ) => void);

  /**
   * Asynchronously creates a directory.
   *
   * @see https://nodejs.org/api/fs.html#fsmkdirpath-options-callback
   */
  mkdir:
    | ((
        path: PathLike,
        options: MakeDirectoryOptions & { recursive: true },
        callback: (
          err: NodeJS.ErrnoException | null,
          path?: string | undefined
        ) => void
      ) => void)
    | ((
        path: PathLike,
        options:
          | Mode
          | (MakeDirectoryOptions & { recursive?: false | undefined })
          | null
          | undefined,
        callback: NoParamCallback
      ) => void)
    | ((
        path: PathLike,
        options: Mode | MakeDirectoryOptions | null | undefined,
        callback: (
          err: NodeJS.ErrnoException | null,
          path?: string | undefined
        ) => void
      ) => void)
    | ((path: PathLike, callback: NoParamCallback) => void);

  /**
   * Creates a unique temporary directory by appending six random characters to the required `prefix`.
   *
   * @see https://nodejs.org/api/fs.html#fsmkdtempprefix-options-callback
   */
  mkdtemp:
    | ((
        prefix: string,
        options: EncodingOption,
        callback: (err: NodeJS.ErrnoException | null, folder: string) => void
      ) => void)
    | ((
        prefix: string,
        options: BufferEncodingOption,
        callback: (
          err: NodeJS.ErrnoException | null,
          folder: NonSharedBuffer
        ) => void
      ) => void)
    | ((
        prefix: string,
        options: EncodingOption,
        callback: (
          err: NodeJS.ErrnoException | null,
          folder: string | NonSharedBuffer
        ) => void
      ) => void)
    | ((
        prefix: string,
        callback: (err: NodeJS.ErrnoException | null, folder: string) => void
      ) => void);

  /**
   * Asynchronous file open. Creates, opens, or truncates a file.
   *
   * @see https://nodejs.org/api/fs.html#fsopenpath-flags-mode-callback
   */
  open:
    | ((
        path: PathLike,
        flags: OpenMode | undefined,
        mode: Mode | null | undefined,
        callback: (err: NodeJS.ErrnoException | null, fd: number) => void
      ) => void)
    | ((
        path: PathLike,
        flags: OpenMode | undefined,
        callback: (err: NodeJS.ErrnoException | null, fd: number) => void
      ) => void)
    | ((
        path: PathLike,
        callback: (err: NodeJS.ErrnoException | null, fd: number) => void
      ) => void);

  /**
   * Returns a {@link https://nodejs.org/api/buffer.html#class-blob | `Blob`} whose data is backed by the given file.
   *
   * @see https://nodejs.org/api/fs.html#fsopenasblobpath-options
   */
  openAsBlob: (
    path: PathLike,
    options?: OpenAsBlobOptions | undefined
  ) => Promise<Blob>;

  /**
   * Asynchronously opens a directory.
   *
   * @see https://nodejs.org/api/fs.html#fsopendirpath-options-callback
   */
  opendir:
    | ((
        path: PathLike,
        cb: (err: NodeJS.ErrnoException | null, dir: Dir) => void
      ) => void)
    | ((
        path: PathLike,
        options: OpenDirOptions,
        cb: (err: NodeJS.ErrnoException | null, dir: Dir) => void
      ) => void);

  /**
   * Reads data from the file specified by the file descriptor `fd`.
   *
   * @see https://nodejs.org/api/fs.html#fsreadfd-buffer-offset-length-position-callback
   */
  read:
    | (<TBuffer extends NodeJS.ArrayBufferView>(
        fd: number,
        buffer: TBuffer,
        offset: number,
        length: number,
        position: ReadPosition | null,
        callback: (
          err: NodeJS.ErrnoException | null,
          bytesRead: number,
          buffer: TBuffer
        ) => void
      ) => void)
    | (<TBuffer extends NodeJS.ArrayBufferView = NonSharedBuffer>(
        fd: number,
        options: ReadOptionsWithBuffer<TBuffer>,
        callback: (
          err: NodeJS.ErrnoException | null,
          bytesRead: number,
          buffer: TBuffer
        ) => void
      ) => void)
    | (<TBuffer extends NodeJS.ArrayBufferView>(
        fd: number,
        buffer: TBuffer,
        options: ReadOptions,
        callback: (
          err: NodeJS.ErrnoException | null,
          bytesRead: number,
          buffer: TBuffer
        ) => void
      ) => void)
    | (<TBuffer extends NodeJS.ArrayBufferView>(
        fd: number,
        buffer: TBuffer,
        callback: (
          err: NodeJS.ErrnoException | null,
          bytesRead: number,
          buffer: TBuffer
        ) => void
      ) => void)
    | ((
        fd: number,
        callback: (
          err: NodeJS.ErrnoException | null,
          bytesRead: number,
          buffer: NonSharedBuffer
        ) => void
      ) => void);

  /**
   * Reads the contents of a directory.
   *
   * @see https://nodejs.org/api/fs.html#fsreaddirpath-options-callback
   */
  readdir:
    | ((
        path: PathLike,
        options:
          | BufferEncoding
          | {
              encoding: BufferEncoding | null;
              withFileTypes?: false | undefined;
              recursive?: boolean | undefined;
            }
          | null
          | undefined,
        callback: (err: NodeJS.ErrnoException | null, files: string[]) => void
      ) => void)
    | ((
        path: PathLike,
        options:
          | "buffer"
          | {
              encoding: "buffer";
              withFileTypes?: false | undefined;
              recursive?: boolean | undefined;
            },
        callback: (
          err: NodeJS.ErrnoException | null,
          files: NonSharedBuffer[]
        ) => void
      ) => void)
    | ((
        path: PathLike,
        options:
          | BufferEncoding
          | (ObjectEncodingOptions & {
              withFileTypes?: false | undefined;
              recursive?: boolean | undefined;
            })
          | null
          | undefined,
        callback: (
          err: NodeJS.ErrnoException | null,
          files: string[] | NonSharedBuffer[]
        ) => void
      ) => void)
    | ((
        path: PathLike,
        callback: (err: NodeJS.ErrnoException | null, files: string[]) => void
      ) => void)
    | ((
        path: PathLike,
        options: ObjectEncodingOptions & {
          withFileTypes: true;
          recursive?: boolean | undefined;
        },
        callback: (
          err: NodeJS.ErrnoException | null,
          files: Dirent<string>[]
        ) => void
      ) => void)
    | ((
        path: PathLike,
        options: {
          encoding: "buffer";
          withFileTypes: true;
          recursive?: boolean | undefined;
        },
        callback: (
          err: NodeJS.ErrnoException | null,
          files: Dirent<NonSharedBuffer>[]
        ) => void
      ) => void);

  /**
   * Asynchronously reads the entire contents of a file.
   *
   * @see https://nodejs.org/api/fs.html#fsreadfilepath-options-callback
   */
  readFile:
    | ((
        path: PathOrFileDescriptor,
        options:
          | ({
              encoding?: null | undefined;
              flag?: string | undefined;
            } & Abortable)
          | null
          | undefined,
        callback: (
          err: NodeJS.ErrnoException | null,
          data: NonSharedBuffer
        ) => void
      ) => void)
    | ((
        path: PathOrFileDescriptor,
        options:
          | BufferEncoding
          | ({
              encoding: BufferEncoding;
              flag?: string | undefined;
            } & Abortable),
        callback: (err: NodeJS.ErrnoException | null, data: string) => void
      ) => void)
    | ((
        path: PathOrFileDescriptor,
        options:
          | BufferEncoding
          | (ObjectEncodingOptions & { flag?: string | undefined } & Abortable)
          | null
          | undefined,
        callback: (
          err: NodeJS.ErrnoException | null,
          data: string | NonSharedBuffer
        ) => void
      ) => void)
    | ((
        path: PathOrFileDescriptor,
        callback: (
          err: NodeJS.ErrnoException | null,
          data: NonSharedBuffer
        ) => void
      ) => void);

  /**
   * Reads the contents of the symbolic link referred to by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsreadlinkpath-options-callback
   */
  readlink:
    | ((
        path: PathLike,
        options: EncodingOption,
        callback: (
          err: NodeJS.ErrnoException | null,
          linkString: string
        ) => void
      ) => void)
    | ((
        path: PathLike,
        options: BufferEncodingOption,
        callback: (
          err: NodeJS.ErrnoException | null,
          linkString: NonSharedBuffer
        ) => void
      ) => void)
    | ((
        path: PathLike,
        options: EncodingOption,
        callback: (
          err: NodeJS.ErrnoException | null,
          linkString: string | NonSharedBuffer
        ) => void
      ) => void)
    | ((
        path: PathLike,
        callback: (
          err: NodeJS.ErrnoException | null,
          linkString: string
        ) => void
      ) => void);

  /**
   * Reads from a file specified by `fd` and writes to an array of `ArrayBufferView`s.
   *
   * @see https://nodejs.org/api/fs.html#fsreadvfd-buffers-position-callback
   */
  readv:
    | (<TBuffers extends readonly NodeJS.ArrayBufferView[]>(
        fd: number,
        buffers: TBuffers,
        cb: (
          err: NodeJS.ErrnoException | null,
          bytesRead: number,
          buffers: TBuffers
        ) => void
      ) => void)
    | (<TBuffers extends readonly NodeJS.ArrayBufferView[]>(
        fd: number,
        buffers: TBuffers,
        position: number | null,
        cb: (
          err: NodeJS.ErrnoException | null,
          bytesRead: number,
          buffers: TBuffers
        ) => void
      ) => void);

  /**
   * Asynchronously computes the canonical pathname by resolving `.`, `..`, and symbolic links.
   *
   * @see https://nodejs.org/api/fs.html#fsrealpathpath-options-callback
   */
  realpath:
    | ((
        path: PathLike,
        options: EncodingOption,
        callback: (
          err: NodeJS.ErrnoException | null,
          resolvedPath: string
        ) => void
      ) => void)
    | ((
        path: PathLike,
        options: BufferEncodingOption,
        callback: (
          err: NodeJS.ErrnoException | null,
          resolvedPath: NonSharedBuffer
        ) => void
      ) => void)
    | ((
        path: PathLike,
        options: EncodingOption,
        callback: (
          err: NodeJS.ErrnoException | null,
          resolvedPath: string | NonSharedBuffer
        ) => void
      ) => void)
    | ((
        path: PathLike,
        callback: (
          err: NodeJS.ErrnoException | null,
          resolvedPath: string
        ) => void
      ) => void);

  /**
   * Asynchronously renames the file at `oldPath` to the path provided as `newPath`.
   *
   * @see https://nodejs.org/api/fs.html#fsrenameoldpath-newpath-callback
   */
  rename: (
    oldPath: PathLike,
    newPath: PathLike,
    callback: NoParamCallback
  ) => void;

  /**
   * Removes the directory identified by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsrmdirpath-options-callback
   */
  rmdir:
    | ((path: PathLike, callback: NoParamCallback) => void)
    | ((
        path: PathLike,
        options: RmDirOptions,
        callback: NoParamCallback
      ) => void);

  /**
   * Asynchronously removes files and directories (modeled on the standard POSIX `rm` utility).
   *
   * @see https://nodejs.org/api/fs.html#fsrmpath-options-callback
   */
  rm:
    | ((path: PathLike, callback: NoParamCallback) => void)
    | ((path: PathLike, options: RmOptions, callback: NoParamCallback) => void);

  /**
   * Asynchronously retrieves the {@link https://nodejs.org/api/fs.html#class-fsstats | `fs.Stats`} for the supplied `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsstatpath-options-callback
   */
  stat:
    | ((
        path: PathLike,
        callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void
      ) => void)
    | ((
        path: PathLike,
        options: (StatOptions & { bigint?: false | undefined }) | undefined,
        callback: (err: NodeJS.ErrnoException | null, stats: Stats) => void
      ) => void)
    | ((
        path: PathLike,
        options: StatOptions & { bigint: true },
        callback: (
          err: NodeJS.ErrnoException | null,
          stats: BigIntStats
        ) => void
      ) => void)
    | ((
        path: PathLike,
        options: StatOptions | undefined,
        callback: (
          err: NodeJS.ErrnoException | null,
          stats: Stats | BigIntStats
        ) => void
      ) => void);

  /**
   * Asynchronously retrieves information about the mounted file system which contains `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsstatfspath-options-callback
   */
  // cspell:disable-next-line
  statfs:
    | ((
        path: PathLike,
        callback: (err: NodeJS.ErrnoException | null, stats: StatsFs) => void
      ) => void)
    | ((
        path: PathLike,
        options: (StatFsOptions & { bigint?: false | undefined }) | undefined,
        callback: (err: NodeJS.ErrnoException | null, stats: StatsFs) => void
      ) => void)
    | ((
        path: PathLike,
        options: StatFsOptions & { bigint: true },
        callback: (
          err: NodeJS.ErrnoException | null,
          stats: BigIntStatsFs
        ) => void
      ) => void)
    | ((
        path: PathLike,
        options: StatFsOptions | undefined,
        callback: (
          err: NodeJS.ErrnoException | null,
          stats: StatsFs | BigIntStatsFs
        ) => void
      ) => void);

  /**
   * Creates a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fssymlinktarget-path-type-callback
   */
  symlink:
    | ((
        target: PathLike,
        path: PathLike,
        type: "dir" | "file" | "junction" | null | undefined,
        callback: NoParamCallback
      ) => void)
    | ((target: PathLike, path: PathLike, callback: NoParamCallback) => void);

  /**
   * Truncates the file referenced by `path` to the supplied length.
   *
   * @see https://nodejs.org/api/fs.html#fstruncatepath-len-callback
   */
  truncate:
    | ((
        path: PathLike,
        len: number | undefined,
        callback: NoParamCallback
      ) => void)
    | ((path: PathLike, callback: NoParamCallback) => void);

  /**
   * Asynchronously removes a file or symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fsunlinkpath-callback
   */
  unlink: (path: PathLike, callback: NoParamCallback) => void;

  /**
   * Stops watching for changes on the supplied `filename`.
   *
   * @see https://nodejs.org/api/fs.html#fsunwatchfilefilename-listener
   */
  unwatchFile:
    | ((filename: PathLike, listener?: StatsListener | undefined) => void)
    | ((
        filename: PathLike,
        listener?: BigIntStatsListener | undefined
      ) => void);

  /**
   * Changes the file system timestamps of the object referenced by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsutimespath-atime-mtime-callback
   */
  utimes: (
    path: PathLike,
    atime: TimeLike,
    mtime: TimeLike,
    callback: NoParamCallback
  ) => void;

  /**
   * Watches for changes on `filename`, where `filename` is either a file or a directory.
   *
   * @see https://nodejs.org/api/fs.html#fswatchfilename-options-listener
   */
  watch:
    | ((
        filename: PathLike,
        options?:
          | BufferEncoding
          | WatchOptionsWithStringEncoding
          | null
          | undefined,
        listener?: WatchListener<string> | undefined
      ) => FSWatcher)
    | ((
        filename: PathLike,
        options: "buffer" | WatchOptionsWithBufferEncoding,
        listener: WatchListener<NonSharedBuffer>
      ) => FSWatcher)
    | ((
        filename: PathLike,
        options: BufferEncoding | "buffer" | WatchOptions | null,
        listener: WatchListener<string | NonSharedBuffer>
      ) => FSWatcher)
    | ((filename: PathLike, listener: WatchListener<string>) => FSWatcher);

  /**
   * Watches for changes on `filename` by polling its {@link https://nodejs.org/api/fs.html#class-fsstats | `fs.Stats`}.
   *
   * @see https://nodejs.org/api/fs.html#fswatchfilefilename-options-listener
   */
  watchFile:
    | ((
        filename: PathLike,
        options:
          | (WatchFileOptions & { bigint?: false | undefined })
          | undefined,
        listener: StatsListener
      ) => StatWatcher)
    | ((
        filename: PathLike,
        options: (WatchFileOptions & { bigint: true }) | undefined,
        listener: BigIntStatsListener
      ) => StatWatcher)
    | ((filename: PathLike, listener: StatsListener) => StatWatcher);

  /**
   * Writes a buffer or string to the file specified by `fd`.
   *
   * @see https://nodejs.org/api/fs.html#fswritefd-buffer-offset-length-position-callback
   */
  write:
    | (<TBuffer extends NodeJS.ArrayBufferView>(
        fd: number,
        buffer: TBuffer,
        offset: number | null | undefined,
        length: number | null | undefined,
        position: number | null | undefined,
        callback: (
          err: NodeJS.ErrnoException | null,
          written: number,
          buffer: TBuffer
        ) => void
      ) => void)
    | (<TBuffer extends NodeJS.ArrayBufferView>(
        fd: number,
        buffer: TBuffer,
        offset: number | null | undefined,
        length: number | null | undefined,
        callback: (
          err: NodeJS.ErrnoException | null,
          written: number,
          buffer: TBuffer
        ) => void
      ) => void)
    | (<TBuffer extends NodeJS.ArrayBufferView>(
        fd: number,
        buffer: TBuffer,
        offset: number | null | undefined,
        callback: (
          err: NodeJS.ErrnoException | null,
          written: number,
          buffer: TBuffer
        ) => void
      ) => void)
    | (<TBuffer extends NodeJS.ArrayBufferView>(
        fd: number,
        buffer: TBuffer,
        callback: (
          err: NodeJS.ErrnoException | null,
          written: number,
          buffer: TBuffer
        ) => void
      ) => void)
    | (<TBuffer extends NodeJS.ArrayBufferView>(
        fd: number,
        buffer: TBuffer,
        options: WriteOptions,
        callback: (
          err: NodeJS.ErrnoException | null,
          written: number,
          buffer: TBuffer
        ) => void
      ) => void)
    | ((
        fd: number,
        string: string,
        position: number | null | undefined,
        encoding: BufferEncoding | null | undefined,
        callback: (
          err: NodeJS.ErrnoException | null,
          written: number,
          str: string
        ) => void
      ) => void)
    | ((
        fd: number,
        string: string,
        position: number | null | undefined,
        callback: (
          err: NodeJS.ErrnoException | null,
          written: number,
          str: string
        ) => void
      ) => void)
    | ((
        fd: number,
        string: string,
        callback: (
          err: NodeJS.ErrnoException | null,
          written: number,
          str: string
        ) => void
      ) => void);

  /**
   * Asynchronously writes data to a file, replacing the file if it already exists.
   *
   * @see https://nodejs.org/api/fs.html#fswritefilefile-data-options-callback
   */
  writeFile:
    | ((
        file: PathOrFileDescriptor,
        data: string | ArrayBufferView<ArrayBufferLike>,
        options: WriteFileOptions,
        callback: NoParamCallback
      ) => void)
    | ((
        path: PathOrFileDescriptor,
        data: string | ArrayBufferView<ArrayBufferLike>,
        callback: NoParamCallback
      ) => void);

  /**
   * Writes an array of `ArrayBufferView`s to the file specified by `fd`.
   *
   * @see https://nodejs.org/api/fs.html#fswritevfd-buffers-position-callback
   */
  writev:
    | (<TBuffers extends readonly NodeJS.ArrayBufferView[]>(
        fd: number,
        buffers: TBuffers,
        cb: (
          err: NodeJS.ErrnoException | null,
          bytesWritten: number,
          buffers: TBuffers
        ) => void
      ) => void)
    | (<TBuffers extends readonly NodeJS.ArrayBufferView[]>(
        fd: number,
        buffers: TBuffers,
        position: number | null,
        cb: (
          err: NodeJS.ErrnoException | null,
          bytesWritten: number,
          buffers: TBuffers
        ) => void
      ) => void);

  // ---------------------------------------------------------------------------
  // Synchronous API
  // ---------------------------------------------------------------------------

  /**
   * Synchronously tests a user's permissions for the file or directory specified by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsaccesssyncpath-mode
   */
  accessSync: (path: PathLike, mode?: number | undefined) => void;

  /**
   * Synchronously append data to a file, creating the file if it does not yet exist.
   *
   * @see https://nodejs.org/api/fs.html#fsappendfilesyncpath-data-options
   */
  appendFileSync: (
    path: PathOrFileDescriptor,
    data: string | Uint8Array<ArrayBufferLike>,
    options?: WriteFileOptions | undefined
  ) => void;

  /**
   * Synchronously changes the permissions of a file.
   *
   * @see https://nodejs.org/api/fs.html#fschmodsyncpath-mode
   */
  chmodSync: (path: PathLike, mode: Mode) => void;

  /**
   * Synchronously changes the owner and group of a file.
   *
   * @see https://nodejs.org/api/fs.html#fschownsyncpath-uid-gid
   */
  chownSync: (path: PathLike, uid: number, gid: number) => void;

  /**
   * Closes the file descriptor synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fsclosesyncfd
   */
  closeSync: (fd: number) => void;

  /**
   * Synchronously copies `src` to `dest`, overwriting `dest` by default if it already exists.
   *
   * @see https://nodejs.org/api/fs.html#fscopyfilesyncsrc-dest-mode
   */
  copyFileSync: (
    src: PathLike,
    dest: PathLike,
    mode?: number | undefined
  ) => void;

  /**
   * Synchronously copies the entire directory structure from `src` to `dest`, including subdirectories and files.
   *
   * @see https://nodejs.org/api/fs.html#fscpsyncsrc-dest-options
   */
  cpSync: (
    source: string | URL,
    destination: string | URL,
    opts?: CopySyncOptions | undefined
  ) => void;

  /**
   * Returns `true` if the path exists, `false` otherwise.
   *
   * @see https://nodejs.org/api/fs.html#fsexistssyncpath
   */
  existsSync: (path: PathLike) => boolean;

  /**
   * Synchronously sets the permissions on the file referenced by the supplied file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsfchmodsyncfd-mode
   */
  fchmodSync: (fd: number, mode: Mode) => void;

  /**
   * Synchronously sets the owner of the file referenced by the supplied file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsfchownsyncfd-uid-gid
   */
  fchownSync: (fd: number, uid: number, gid: number) => void;

  /**
   * Synchronously forces all currently queued I/O operations associated with the file to the operating system's synchronized I/O completion state.
   *
   * @see https://nodejs.org/api/fs.html#fsfdatasyncsyncfd
   */
  fdatasyncSync: (fd: number) => void;

  /**
   * Retrieves the {@link https://nodejs.org/api/fs.html#class-fsstats | `fs.Stats`} for the file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsfstatsyncfd-options
   */
  fstatSync:
    | ((
        fd: number,
        options?: (StatOptions & { bigint?: false | undefined }) | undefined
      ) => Stats)
    | ((fd: number, options: StatOptions & { bigint: true }) => BigIntStats)
    | ((fd: number, options?: StatOptions | undefined) => Stats | BigIntStats);

  /**
   * Requests that all data for the open file descriptor is flushed to the storage device synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fsfsyncsyncfd
   */
  fsyncSync: (fd: number) => void;

  /**
   * Truncates the file descriptor synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fsftruncatesyncfd-len
   */
  ftruncateSync: (fd: number, len?: number | undefined) => void;

  /**
   * Synchronous version of {@link FileSystemInterface.futimes | `futimes`}.
   *
   * @see https://nodejs.org/api/fs.html#fsfutimessyncfd-atime-mtime
   */
  futimesSync: (fd: number, atime: TimeLike, mtime: TimeLike) => void;

  /**
   * Synchronously retrieves the files matching the specified glob pattern.
   *
   * @see https://nodejs.org/api/fs.html#fsglobsyncpattern-options
   */
  globSync:
    | ((pattern: string | readonly string[]) => string[])
    | ((
        pattern: string | readonly string[],
        options: GlobOptionsWithFileTypes
      ) => Dirent<string>[])
    | ((
        pattern: string | readonly string[],
        options: GlobOptionsWithoutFileTypes
      ) => string[])
    | ((
        pattern: string | readonly string[],
        options: GlobOptions
      ) => string[] | Dirent<string>[]);

  /**
   * Synchronously changes the permissions on a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fslchmodsyncpath-mode
   */
  lchmodSync: (path: PathLike, mode: Mode) => void;

  /**
   * Synchronously sets the owner of the symbolic link path.
   *
   * @see https://nodejs.org/api/fs.html#fslchownsyncpath-uid-gid
   */
  lchownSync: (path: PathLike, uid: number, gid: number) => void;

  /**
   * Synchronously changes the access and modification times of a symbolic link without dereferencing it.
   *
   * @see https://nodejs.org/api/fs.html#fslutimessyncpath-atime-mtime
   */
  lutimesSync: (path: PathLike, atime: TimeLike, mtime: TimeLike) => void;

  /**
   * Creates a new hard link from `existingPath` to `newPath` synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fslinksyncexistingpath-newpath
   */
  linkSync: (existingPath: PathLike, newPath: PathLike) => void;

  /**
   * Retrieves the {@link https://nodejs.org/api/fs.html#class-fsstats | `fs.Stats`} for the symbolic link referred to by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fslstatsyncpath-options
   */
  lstatSync:
    | ((path: PathLike, options?: undefined) => Stats)
    | ((
        path: PathLike,
        options?:
          | (StatSyncOptions & {
              bigint?: false | undefined;
              throwIfNoEntry: false;
            })
          | undefined
      ) => Stats | undefined)
    | ((
        path: PathLike,
        options: StatSyncOptions & { bigint: true; throwIfNoEntry: false }
      ) => BigIntStats | undefined)
    | ((
        path: PathLike,
        options?: (StatSyncOptions & { bigint?: false | undefined }) | undefined
      ) => Stats)
    | ((
        path: PathLike,
        options: StatSyncOptions & { bigint: true }
      ) => BigIntStats)
    | ((
        path: PathLike,
        options: StatSyncOptions & {
          bigint: boolean;
          throwIfNoEntry?: false | undefined;
        }
      ) => Stats | BigIntStats)
    | ((
        path: PathLike,
        options?: StatSyncOptions | undefined
      ) => Stats | BigIntStats | undefined);

  /**
   * Synchronously creates a directory.
   *
   * @see https://nodejs.org/api/fs.html#fsmkdirsyncpath-options
   */
  mkdirSync:
    | ((
        path: PathLike,
        options: MakeDirectoryOptions & { recursive: true }
      ) => string | undefined)
    | ((
        path: PathLike,
        options?:
          | Mode
          | (MakeDirectoryOptions & { recursive?: false | undefined })
          | null
          | undefined
      ) => void)
    | ((
        path: PathLike,
        options?: Mode | MakeDirectoryOptions | null | undefined
      ) => string | undefined);

  /**
   * Creates a unique temporary directory synchronously, returning the created directory path.
   *
   * @see https://nodejs.org/api/fs.html#fsmkdtempsyncprefix-options
   */
  mkdtempSync:
    | ((prefix: string, options?: EncodingOption) => string)
    | ((prefix: string, options: BufferEncodingOption) => NonSharedBuffer)
    | ((prefix: string, options?: EncodingOption) => string | NonSharedBuffer);

  /**
   * Synchronously opens a directory.
   *
   * @see https://nodejs.org/api/fs.html#fsopendirsyncpath-options
   */
  opendirSync: (path: PathLike, options?: OpenDirOptions | undefined) => Dir;

  /**
   * Returns an integer representing the file descriptor by opening the file synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fsopensyncpath-flags-mode
   */
  openSync: (
    path: PathLike,
    flags: OpenMode,
    mode?: Mode | null | undefined
  ) => number;

  /**
   * Synchronously reads the contents of a directory.
   *
   * @see https://nodejs.org/api/fs.html#fsreaddirsyncpath-options
   */
  readdirSync:
    | ((
        path: PathLike,
        options?:
          | BufferEncoding
          | {
              encoding: BufferEncoding | null;
              withFileTypes?: false | undefined;
              recursive?: boolean | undefined;
            }
          | null
          | undefined
      ) => string[])
    | ((
        path: PathLike,
        options:
          | "buffer"
          | {
              encoding: "buffer";
              withFileTypes?: false | undefined;
              recursive?: boolean | undefined;
            }
      ) => NonSharedBuffer[])
    | ((
        path: PathLike,
        options?:
          | BufferEncoding
          | (ObjectEncodingOptions & {
              withFileTypes?: false | undefined;
              recursive?: boolean | undefined;
            })
          | null
          | undefined
      ) => string[] | NonSharedBuffer[])
    | ((
        path: PathLike,
        options: ObjectEncodingOptions & {
          withFileTypes: true;
          recursive?: boolean | undefined;
        }
      ) => Dirent<string>[])
    | ((
        path: PathLike,
        options: {
          encoding: "buffer";
          withFileTypes: true;
          recursive?: boolean | undefined;
        }
      ) => Dirent<NonSharedBuffer>[]);

  /**
   * Returns the contents of the `path` synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fsreadfilesyncpath-options
   */
  readFileSync:
    | ((
        path: PathOrFileDescriptor,
        options?:
          | { encoding?: null | undefined; flag?: string | undefined }
          | null
          | undefined
      ) => NonSharedBuffer)
    | ((
        path: PathOrFileDescriptor,
        options:
          | BufferEncoding
          | { encoding: BufferEncoding; flag?: string | undefined }
      ) => string)
    | ((
        path: PathOrFileDescriptor,
        options?:
          | BufferEncoding
          | (ObjectEncodingOptions & { flag?: string | undefined })
          | null
          | undefined
      ) => string | NonSharedBuffer);

  /**
   * Synchronously reads the contents of the symbolic link referred to by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsreadlinksyncpath-options
   */
  readlinkSync:
    | ((path: PathLike, options?: EncodingOption) => string)
    | ((path: PathLike, options: BufferEncodingOption) => NonSharedBuffer)
    | ((path: PathLike, options?: EncodingOption) => string | NonSharedBuffer);

  /**
   * Returns the number of bytes read from the file specified by `fd` synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fsreadsyncfd-buffer-offset-length-position
   */
  readSync:
    | ((
        fd: number,
        buffer: ArrayBufferView<ArrayBufferLike>,
        offset: number,
        length: number,
        position: ReadPosition | null
      ) => number)
    | ((
        fd: number,
        buffer: ArrayBufferView<ArrayBufferLike>,
        opts?: ReadOptions | undefined
      ) => number);

  /**
   * Synchronously reads from a file specified by `fd` and writes to an array of `ArrayBufferView`s.
   *
   * @see https://nodejs.org/api/fs.html#fsreadvsyncfd-buffers-position
   */
  readvSync: (
    fd: number,
    buffers: readonly ArrayBufferView<ArrayBufferLike>[],
    position?: number | undefined
  ) => number;

  /**
   * Returns the resolved pathname synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fsrealpathsyncpath-options
   */
  realpathSync:
    | ((path: PathLike, options?: EncodingOption) => string)
    | ((path: PathLike, options: BufferEncodingOption) => NonSharedBuffer)
    | ((path: PathLike, options?: EncodingOption) => string | NonSharedBuffer);

  /**
   * Synchronously renames the file at `oldPath` to the path provided as `newPath`.
   *
   * @see https://nodejs.org/api/fs.html#fsrenamesyncoldpath-newpath
   */
  renameSync: (oldPath: PathLike, newPath: PathLike) => void;

  /**
   * Synchronously removes the directory identified by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsrmdirsyncpath-options
   */
  rmdirSync: (path: PathLike, options?: RmDirOptions | undefined) => void;

  /**
   * Synchronously removes files and directories (modeled on the standard POSIX `rm` utility).
   *
   * @see https://nodejs.org/api/fs.html#fsrmsyncpath-options
   */
  rmSync: (path: PathLike, options?: RmOptions | undefined) => void;

  /**
   * Synchronously retrieves the {@link https://nodejs.org/api/fs.html#class-fsstats | `fs.Stats`} for the supplied `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsstatsyncpath-options
   */
  statSync:
    | ((path: PathLike, options?: undefined) => Stats)
    | ((
        path: PathLike,
        options?:
          | (StatSyncOptions & {
              bigint?: false | undefined;
              throwIfNoEntry: false;
            })
          | undefined
      ) => Stats | undefined)
    | ((
        path: PathLike,
        options: StatSyncOptions & { bigint: true; throwIfNoEntry: false }
      ) => BigIntStats | undefined)
    | ((
        path: PathLike,
        options?: (StatSyncOptions & { bigint?: false | undefined }) | undefined
      ) => Stats)
    | ((
        path: PathLike,
        options: StatSyncOptions & { bigint: true }
      ) => BigIntStats)
    | ((
        path: PathLike,
        options: StatSyncOptions & {
          bigint: boolean;
          throwIfNoEntry?: false | undefined;
        }
      ) => Stats | BigIntStats)
    | ((
        path: PathLike,
        options?: StatSyncOptions | undefined
      ) => Stats | BigIntStats | undefined);

  /**
   * Synchronously retrieves information about the mounted file system which contains `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsstatfssyncpath-options
   */
  // cspell:disable-next-line
  statfsSync:
    | ((
        path: PathLike,
        options?: (StatFsOptions & { bigint?: false | undefined }) | undefined
      ) => StatsFs)
    | ((
        path: PathLike,
        options: StatFsOptions & { bigint: true }
      ) => BigIntStatsFs)
    | ((
        path: PathLike,
        options?: StatFsOptions | undefined
      ) => StatsFs | BigIntStatsFs);

  /**
   * Creates a symbolic link synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fssymlinksynctarget-path-type
   */
  symlinkSync: (
    target: PathLike,
    path: PathLike,
    type?: "dir" | "file" | "junction" | null | undefined
  ) => void;

  /**
   * Truncates the file referenced by `path` to the supplied length synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fstruncatesyncpath-len
   */
  truncateSync: (path: PathLike, len?: number | undefined) => void;

  /**
   * Synchronously removes a file or symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fsunlinksyncpath
   */
  unlinkSync: (path: PathLike) => void;

  /**
   * Synchronously changes the file system timestamps of the object referenced by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsutimessyncpath-atime-mtime
   */
  utimesSync: (path: PathLike, atime: TimeLike, mtime: TimeLike) => void;

  /**
   * Synchronously writes data to a file, replacing the file if it already exists.
   *
   * @see https://nodejs.org/api/fs.html#fswritefilesyncfile-data-options
   */
  writeFileSync: (
    file: PathOrFileDescriptor,
    data: string | ArrayBufferView<ArrayBufferLike>,
    options?: WriteFileOptions | undefined
  ) => void;

  /**
   * Writes a buffer or string to the file specified by `fd` synchronously, returning the number of bytes written.
   *
   * @see https://nodejs.org/api/fs.html#fswritesyncfd-buffer-offset-length-position
   */
  writeSync:
    | ((
        fd: number,
        buffer: ArrayBufferView<ArrayBufferLike>,
        offset?: number | null | undefined,
        length?: number | null | undefined,
        position?: number | null | undefined
      ) => number)
    | ((
        fd: number,
        string: string,
        position?: number | null | undefined,
        encoding?: BufferEncoding | null | undefined
      ) => number);

  /**
   * Writes an array of `ArrayBufferView`s to the file specified by `fd` synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fswritevsyncfd-buffers-position
   */
  writevSync: (
    fd: number,
    buffers: readonly ArrayBufferView<ArrayBufferLike>[],
    position?: number | undefined
  ) => number;
}

export interface NodejsFileSystemInterface extends BaseFileSystemInterface {
  /**
   * The promise-based file system API, equivalent to the [`node:fs/promises`](https://nodejs.org/api/fs.html#promises-api) module.
   *
   * @see https://nodejs.org/api/fs.html#promises-api
   */
  promises: PromisesFileSystemInterface;
}

/**
 * An interface describing the exports of the Node.js [`node:fs`](https://nodejs.org/api/fs.html) and [`node:fs/promises`](https://nodejs.org/api/fs.html#promises-api) modules.
 *
 * @remarks
 * This interface mirrors the shape of the built-in `node:fs` module so that a custom file system implementation (for example, an in-memory, virtual, or remote file system) can be provided anywhere a real file system is expected. Each member is typed against its corresponding `node:fs` export, which preserves all of the original call signatures and overloads. Exports of `node:fs/promises` are available as `Async`-suffixed members of this interface (for example, `readFile` becomes `readFileAsync`).
 *
 * @see https://nodejs.org/api/fs.html
 * @see https://nodejs.org/api/fs.html#promises-api
 */
export type FileSystemInterface = BaseFileSystemInterface & {
  [key in keyof PromisesFileSystemInterface as key extends `${string}Async`
    ? key
    : `${key}Async`]: PromisesFileSystemInterface[key];
};
