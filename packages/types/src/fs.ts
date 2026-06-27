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

import type * as fs from "node:fs";
import type * as promises from "node:fs/promises";

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
  access: typeof promises.access;
  /**
   * Asynchronously appends data to a file, creating the file if it does not yet exist.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesappendfilepath-data-options
   */
  appendFile: typeof promises.appendFile;
  /**
   * Asynchronously changes the permissions of a file.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseschmodpath-mode
   */
  chmod: typeof promises.chmod;
  /**
   * Asynchronously changes owner and group of a file.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseschownpath-uid-gid
   */
  chown: typeof promises.chown;
  /**
   * Asynchronously copies `src` to `dest`.
   *
   * @see https://nodejs.org/api/fs.html#fspromisescopyfilesrc-dest-mode
   */
  copyFile: typeof promises.copyFile;
  /**
   * Asynchronously copies directory structures and files.
   *
   * @see https://nodejs.org/api/fs.html#fspromisescpsrc-dest-options
   */
  cp: typeof promises.cp;
  /**
   * Asynchronously expands glob patterns and yields matching entries.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesglobpattern-options
   */
  glob: typeof promises.glob;
  /**
   * Changes the permissions on a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseslchmodpath-mode
   */
  lchmod: typeof promises.lchmod;
  /**
   * Changes owner and group on a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseslchownpath-uid-gid
   */
  lchown: typeof promises.lchown;
  /**
   * Changes access and modification times on a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseslutimespath-atime-mtime
   */
  lutimes: typeof promises.lutimes;
  /**
   * Creates a new hard link.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseslinkexistingpath-newpath
   */
  link: typeof promises.link;
  /**
   * Retrieves stats for a symbolic link path.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseslstatpath-options
   */
  lstat: typeof promises.lstat;
  /**
   * Asynchronously creates a directory.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesmkdirpath-options
   */
  mkdir: typeof promises.mkdir;
  /**
   * Creates a unique temporary directory.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesmkdtempprefix-options
   */
  mkdtemp: typeof promises.mkdtemp;
  /**
   * Creates a unique async-disposable temporary directory.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesmkdtempdisposableprefix-options
   */
  mkdtempDisposable: typeof promises.mkdtempDisposable;
  /**
   * Opens a file and returns a file handle.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesopenpath-flags-mode
   */
  open: typeof promises.open;
  /**
   * Opens a directory for async iteration.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesopendirpath-options
   */
  opendir: typeof promises.opendir;
  /**
   * Reads directory entries.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesreaddirpath-options
   */
  readdir: typeof promises.readdir;
  /**
   * Reads the entire contents of a file.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesreadfilepath-options
   */
  readFile: typeof promises.readFile;
  /**
   * Reads the value of a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesreadlinkpath-options
   */
  readlink: typeof promises.readlink;
  /**
   * Resolves a path to its canonical absolute path.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesrealpathpath-options
   */
  realpath: typeof promises.realpath;
  /**
   * Renames a file or directory.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesrenameoldpath-newpath
   */
  rename: typeof promises.rename;
  /**
   * Removes files and directories.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesrmpath-options
   */
  rm: typeof promises.rm;
  /**
   * Removes a directory.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesrmdirpath-options
   */
  rmdir: typeof promises.rmdir;
  /**
   * Retrieves stats for a path.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesstatpath-options
   */
  stat: typeof promises.stat;
  /**
   * Retrieves filesystem stats for a path.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesstatfspath-options
   */
  statfs: typeof promises.statfs;
  /**
   * Creates a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fspromisessymlinktarget-path-type
   */
  symlink: typeof promises.symlink;
  /**
   * Truncates a file to the specified length.
   *
   * @see https://nodejs.org/api/fs.html#fspromisestruncatepath-len
   */
  truncate: typeof promises.truncate;
  /**
   * Removes a file or symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesunlinkpath
   */
  unlink: typeof promises.unlink;
  /**
   * Changes access and modification times of a file.
   *
   * @see https://nodejs.org/api/fs.html#fspromisesutimespath-atime-mtime
   */
  utimes: typeof promises.utimes;
  /**
   * Watches for filesystem changes and yields events.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseswatchfilename-options
   */
  watch: typeof promises.watch;
  /**
   * Asynchronously writes data to a file.
   *
   * @see https://nodejs.org/api/fs.html#fspromiseswritefilefile-data-options
   */
  writeFile: typeof promises.writeFile;
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
  access: typeof fs.access;
  /**
   * Asynchronously append data to a file, creating the file if it does not yet exist.
   *
   * @see https://nodejs.org/api/fs.html#fsappendfilepath-data-options-callback
   */
  appendFile: typeof fs.appendFile;
  /**
   * Asynchronously changes the permissions of a file.
   *
   * @see https://nodejs.org/api/fs.html#fschmodpath-mode-callback
   */
  chmod: typeof fs.chmod;
  /**
   * Asynchronously changes the owner and group of a file.
   *
   * @see https://nodejs.org/api/fs.html#fschownpath-uid-gid-callback
   */
  chown: typeof fs.chown;
  /**
   * Closes the file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsclosefd-callback
   */
  close: typeof fs.close;
  /**
   * Asynchronously copies `src` to `dest`, overwriting `dest` by default if it already exists.
   *
   * @see https://nodejs.org/api/fs.html#fscopyfilesrc-dest-mode-callback
   */
  copyFile: typeof fs.copyFile;
  /**
   * Asynchronously copies the entire directory structure from `src` to `dest`, including subdirectories and files.
   *
   * @see https://nodejs.org/api/fs.html#fscpsrc-dest-options-callback
   */
  cp: typeof fs.cp;
  /**
   * Returns a new {@link https://nodejs.org/api/fs.html#class-fsreadstream | `fs.ReadStream`} object.
   *
   * @see https://nodejs.org/api/fs.html#fscreatereadstreampath-options
   */
  createReadStream: typeof fs.createReadStream;
  /**
   * Returns a new {@link https://nodejs.org/api/fs.html#class-fswritestream | `fs.WriteStream`} object.
   *
   * @see https://nodejs.org/api/fs.html#fscreatewritestreampath-options
   */
  createWriteStream: typeof fs.createWriteStream;
  /**
   * Tests whether or not the given path exists by checking with the file system.
   *
   * @deprecated Use {@link FileSystemInterface.access | `access`} or {@link FileSystemInterface.stat | `stat`} instead.
   * @see https://nodejs.org/api/fs.html#fsexistspath-callback
   */
  exists: typeof fs.exists;
  /**
   * Sets the permissions on the file referenced by the supplied file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsfchmodfd-mode-callback
   */
  fchmod: typeof fs.fchmod;
  /**
   * Sets the owner of the file referenced by the supplied file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsfchownfd-uid-gid-callback
   */
  fchown: typeof fs.fchown;
  /**
   * Forces all currently queued I/O operations associated with the file to the operating system's synchronized I/O completion state.
   *
   * @see https://nodejs.org/api/fs.html#fsfdatasyncfd-callback
   */
  fdatasync: typeof fs.fdatasync;
  /**
   * Invokes the callback with the {@link https://nodejs.org/api/fs.html#class-fsstats | `fs.Stats`} for the file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsfstatfd-options-callback
   */
  fstat: typeof fs.fstat;
  /**
   * Requests that all data for the open file descriptor is flushed to the storage device.
   *
   * @see https://nodejs.org/api/fs.html#fsfsyncfd-callback
   */
  fsync: typeof fs.fsync;
  /**
   * Truncates the file descriptor to the supplied length.
   *
   * @see https://nodejs.org/api/fs.html#fsftruncatefd-len-callback
   */
  ftruncate: typeof fs.ftruncate;
  /**
   * Changes the file system timestamps of the object referenced by the supplied file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsfutimesfd-atime-mtime-callback
   */
  futimes: typeof fs.futimes;
  /**
   * Retrieves the files matching the specified glob pattern.
   *
   * @see https://nodejs.org/api/fs.html#fsglobpattern-options-callback
   */
  glob: typeof fs.glob;
  /**
   * Changes the permissions on a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fslchmodpath-mode-callback
   */
  lchmod: typeof fs.lchmod;
  /**
   * Sets the owner of the symbolic link path.
   *
   * @see https://nodejs.org/api/fs.html#fslchownpath-uid-gid-callback
   */
  lchown: typeof fs.lchown;
  /**
   * Changes the access and modification times of a symbolic link without dereferencing it.
   *
   * @see https://nodejs.org/api/fs.html#fslutimespath-atime-mtime-callback
   */
  lutimes: typeof fs.lutimes;
  /**
   * Creates a new hard link from `existingPath` to `newPath`.
   *
   * @see https://nodejs.org/api/fs.html#fslinkexistingpath-newpath-callback
   */
  link: typeof fs.link;
  /**
   * Retrieves the {@link https://nodejs.org/api/fs.html#class-fsstats | `fs.Stats`} for the symbolic link referred to by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fslstatpath-options-callback
   */
  lstat: typeof fs.lstat;
  /**
   * Asynchronously creates a directory.
   *
   * @see https://nodejs.org/api/fs.html#fsmkdirpath-options-callback
   */
  mkdir: typeof fs.mkdir;
  /**
   * Creates a unique temporary directory by appending six random characters to the required `prefix`.
   *
   * @see https://nodejs.org/api/fs.html#fsmkdtempprefix-options-callback
   */
  mkdtemp: typeof fs.mkdtemp;
  /**
   * Asynchronous file open. Creates, opens, or truncates a file.
   *
   * @see https://nodejs.org/api/fs.html#fsopenpath-flags-mode-callback
   */
  open: typeof fs.open;
  /**
   * Returns a {@link https://nodejs.org/api/buffer.html#class-blob | `Blob`} whose data is backed by the given file.
   *
   * @see https://nodejs.org/api/fs.html#fsopenasblobpath-options
   */
  openAsBlob: typeof fs.openAsBlob;
  /**
   * Asynchronously opens a directory.
   *
   * @see https://nodejs.org/api/fs.html#fsopendirpath-options-callback
   */
  opendir: typeof fs.opendir;
  /**
   * Reads data from the file specified by the file descriptor `fd`.
   *
   * @see https://nodejs.org/api/fs.html#fsreadfd-buffer-offset-length-position-callback
   */
  read: typeof fs.read;
  /**
   * Reads the contents of a directory.
   *
   * @see https://nodejs.org/api/fs.html#fsreaddirpath-options-callback
   */
  readdir: typeof fs.readdir;
  /**
   * Asynchronously reads the entire contents of a file.
   *
   * @see https://nodejs.org/api/fs.html#fsreadfilepath-options-callback
   */
  readFile: typeof fs.readFile;
  /**
   * Reads the contents of the symbolic link referred to by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsreadlinkpath-options-callback
   */
  readlink: typeof fs.readlink;
  /**
   * Reads from a file specified by `fd` and writes to an array of `ArrayBufferView`s.
   *
   * @see https://nodejs.org/api/fs.html#fsreadvfd-buffers-position-callback
   */
  readv: typeof fs.readv;
  /**
   * Asynchronously computes the canonical pathname by resolving `.`, `..`, and symbolic links.
   *
   * @see https://nodejs.org/api/fs.html#fsrealpathpath-options-callback
   */
  realpath: typeof fs.realpath;
  /**
   * Asynchronously renames the file at `oldPath` to the path provided as `newPath`.
   *
   * @see https://nodejs.org/api/fs.html#fsrenameoldpath-newpath-callback
   */
  rename: typeof fs.rename;
  /**
   * Removes the directory identified by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsrmdirpath-options-callback
   */
  rmdir: typeof fs.rmdir;
  /**
   * Asynchronously removes files and directories (modeled on the standard POSIX `rm` utility).
   *
   * @see https://nodejs.org/api/fs.html#fsrmpath-options-callback
   */
  rm: typeof fs.rm;
  /**
   * Asynchronously retrieves the {@link https://nodejs.org/api/fs.html#class-fsstats | `fs.Stats`} for the supplied `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsstatpath-options-callback
   */
  stat: typeof fs.stat;
  /**
   * Asynchronously retrieves information about the mounted file system which contains `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsstatfspath-options-callback
   */
  // cspell:disable-next-line
  statfs: typeof fs.statfs;
  /**
   * Creates a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fssymlinktarget-path-type-callback
   */
  symlink: typeof fs.symlink;
  /**
   * Truncates the file referenced by `path` to the supplied length.
   *
   * @see https://nodejs.org/api/fs.html#fstruncatepath-len-callback
   */
  truncate: typeof fs.truncate;
  /**
   * Asynchronously removes a file or symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fsunlinkpath-callback
   */
  unlink: typeof fs.unlink;
  /**
   * Stops watching for changes on the supplied `filename`.
   *
   * @see https://nodejs.org/api/fs.html#fsunwatchfilefilename-listener
   */
  unwatchFile: typeof fs.unwatchFile;
  /**
   * Changes the file system timestamps of the object referenced by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsutimespath-atime-mtime-callback
   */
  utimes: typeof fs.utimes;
  /**
   * Watches for changes on `filename`, where `filename` is either a file or a directory.
   *
   * @see https://nodejs.org/api/fs.html#fswatchfilename-options-listener
   */
  watch: typeof fs.watch;
  /**
   * Watches for changes on `filename` by polling its {@link https://nodejs.org/api/fs.html#class-fsstats | `fs.Stats`}.
   *
   * @see https://nodejs.org/api/fs.html#fswatchfilefilename-options-listener
   */
  watchFile: typeof fs.watchFile;
  /**
   * Writes a buffer or string to the file specified by `fd`.
   *
   * @see https://nodejs.org/api/fs.html#fswritefd-buffer-offset-length-position-callback
   */
  write: typeof fs.write;
  /**
   * Asynchronously writes data to a file, replacing the file if it already exists.
   *
   * @see https://nodejs.org/api/fs.html#fswritefilefile-data-options-callback
   */
  writeFile: typeof fs.writeFile;
  /**
   * Writes an array of `ArrayBufferView`s to the file specified by `fd`.
   *
   * @see https://nodejs.org/api/fs.html#fswritevfd-buffers-position-callback
   */
  writev: typeof fs.writev;
  // ---------------------------------------------------------------------------
  // Synchronous API
  // ---------------------------------------------------------------------------

  /**
   * Synchronously tests a user's permissions for the file or directory specified by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsaccesssyncpath-mode
   */
  accessSync: typeof fs.accessSync;
  /**
   * Synchronously append data to a file, creating the file if it does not yet exist.
   *
   * @see https://nodejs.org/api/fs.html#fsappendfilesyncpath-data-options
   */
  appendFileSync: typeof fs.appendFileSync;
  /**
   * Synchronously changes the permissions of a file.
   *
   * @see https://nodejs.org/api/fs.html#fschmodsyncpath-mode
   */
  chmodSync: typeof fs.chmodSync;
  /**
   * Synchronously changes the owner and group of a file.
   *
   * @see https://nodejs.org/api/fs.html#fschownsyncpath-uid-gid
   */
  chownSync: typeof fs.chownSync;
  /**
   * Closes the file descriptor synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fsclosesyncfd
   */
  closeSync: typeof fs.closeSync;
  /**
   * Synchronously copies `src` to `dest`, overwriting `dest` by default if it already exists.
   *
   * @see https://nodejs.org/api/fs.html#fscopyfilesyncsrc-dest-mode
   */
  copyFileSync: typeof fs.copyFileSync;
  /**
   * Synchronously copies the entire directory structure from `src` to `dest`, including subdirectories and files.
   *
   * @see https://nodejs.org/api/fs.html#fscpsyncsrc-dest-options
   */
  cpSync: typeof fs.cpSync;
  /**
   * Returns `true` if the path exists, `false` otherwise.
   *
   * @see https://nodejs.org/api/fs.html#fsexistssyncpath
   */
  existsSync: typeof fs.existsSync;
  /**
   * Synchronously sets the permissions on the file referenced by the supplied file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsfchmodsyncfd-mode
   */
  fchmodSync: typeof fs.fchmodSync;
  /**
   * Synchronously sets the owner of the file referenced by the supplied file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsfchownsyncfd-uid-gid
   */
  fchownSync: typeof fs.fchownSync;
  /**
   * Synchronously forces all currently queued I/O operations associated with the file to the operating system's synchronized I/O completion state.
   *
   * @see https://nodejs.org/api/fs.html#fsfdatasyncsyncfd
   */
  fdatasyncSync: typeof fs.fdatasyncSync;
  /**
   * Retrieves the {@link https://nodejs.org/api/fs.html#class-fsstats | `fs.Stats`} for the file descriptor.
   *
   * @see https://nodejs.org/api/fs.html#fsfstatsyncfd-options
   */
  fstatSync: typeof fs.fstatSync;
  /**
   * Requests that all data for the open file descriptor is flushed to the storage device synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fsfsyncsyncfd
   */
  fsyncSync: typeof fs.fsyncSync;
  /**
   * Truncates the file descriptor synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fsftruncatesyncfd-len
   */
  ftruncateSync: typeof fs.ftruncateSync;
  /**
   * Synchronous version of {@link FileSystemInterface.futimes | `futimes`}.
   *
   * @see https://nodejs.org/api/fs.html#fsfutimessyncfd-atime-mtime
   */
  futimesSync: typeof fs.futimesSync;
  /**
   * Synchronously retrieves the files matching the specified glob pattern.
   *
   * @see https://nodejs.org/api/fs.html#fsglobsyncpattern-options
   */
  globSync: typeof fs.globSync;
  /**
   * Synchronously changes the permissions on a symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fslchmodsyncpath-mode
   */
  lchmodSync: typeof fs.lchmodSync;
  /**
   * Synchronously sets the owner of the symbolic link path.
   *
   * @see https://nodejs.org/api/fs.html#fslchownsyncpath-uid-gid
   */
  lchownSync: typeof fs.lchownSync;
  /**
   * Synchronously changes the access and modification times of a symbolic link without dereferencing it.
   *
   * @see https://nodejs.org/api/fs.html#fslutimessyncpath-atime-mtime
   */
  lutimesSync: typeof fs.lutimesSync;
  /**
   * Creates a new hard link from `existingPath` to `newPath` synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fslinksyncexistingpath-newpath
   */
  linkSync: typeof fs.linkSync;
  /**
   * Retrieves the {@link https://nodejs.org/api/fs.html#class-fsstats | `fs.Stats`} for the symbolic link referred to by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fslstatsyncpath-options
   */
  lstatSync: typeof fs.lstatSync;
  /**
   * Synchronously creates a directory.
   *
   * @see https://nodejs.org/api/fs.html#fsmkdirsyncpath-options
   */
  mkdirSync: typeof fs.mkdirSync;
  /**
   * Creates a unique temporary directory synchronously, returning the created directory path.
   *
   * @see https://nodejs.org/api/fs.html#fsmkdtempsyncprefix-options
   */
  mkdtempSync: typeof fs.mkdtempSync;
  /**
   * Synchronously opens a directory.
   *
   * @see https://nodejs.org/api/fs.html#fsopendirsyncpath-options
   */
  opendirSync: typeof fs.opendirSync;
  /**
   * Returns an integer representing the file descriptor by opening the file synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fsopensyncpath-flags-mode
   */
  openSync: typeof fs.openSync;
  /**
   * Synchronously reads the contents of a directory.
   *
   * @see https://nodejs.org/api/fs.html#fsreaddirsyncpath-options
   */
  readdirSync: typeof fs.readdirSync;
  /**
   * Returns the contents of the `path` synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fsreadfilesyncpath-options
   */
  readFileSync: typeof fs.readFileSync;
  /**
   * Synchronously reads the contents of the symbolic link referred to by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsreadlinksyncpath-options
   */
  readlinkSync: typeof fs.readlinkSync;
  /**
   * Returns the number of bytes read from the file specified by `fd` synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fsreadsyncfd-buffer-offset-length-position
   */
  readSync: typeof fs.readSync;
  /**
   * Synchronously reads from a file specified by `fd` and writes to an array of `ArrayBufferView`s.
   *
   * @see https://nodejs.org/api/fs.html#fsreadvsyncfd-buffers-position
   */
  readvSync: typeof fs.readvSync;
  /**
   * Returns the resolved pathname synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fsrealpathsyncpath-options
   */
  realpathSync: typeof fs.realpathSync;
  /**
   * Synchronously renames the file at `oldPath` to the path provided as `newPath`.
   *
   * @see https://nodejs.org/api/fs.html#fsrenamesyncoldpath-newpath
   */
  renameSync: typeof fs.renameSync;
  /**
   * Synchronously removes the directory identified by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsrmdirsyncpath-options
   */
  rmdirSync: typeof fs.rmdirSync;
  /**
   * Synchronously removes files and directories (modeled on the standard POSIX `rm` utility).
   *
   * @see https://nodejs.org/api/fs.html#fsrmsyncpath-options
   */
  rmSync: typeof fs.rmSync;
  /**
   * Synchronously retrieves the {@link https://nodejs.org/api/fs.html#class-fsstats | `fs.Stats`} for the supplied `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsstatsyncpath-options
   */
  statSync: typeof fs.statSync;
  /**
   * Synchronously retrieves information about the mounted file system which contains `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsstatfssyncpath-options
   */
  // cspell:disable-next-line
  statfsSync: typeof fs.statfsSync;
  /**
   * Creates a symbolic link synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fssymlinksynctarget-path-type
   */
  symlinkSync: typeof fs.symlinkSync;
  /**
   * Truncates the file referenced by `path` to the supplied length synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fstruncatesyncpath-len
   */
  truncateSync: typeof fs.truncateSync;
  /**
   * Synchronously removes a file or symbolic link.
   *
   * @see https://nodejs.org/api/fs.html#fsunlinksyncpath
   */
  unlinkSync: typeof fs.unlinkSync;
  /**
   * Synchronously changes the file system timestamps of the object referenced by `path`.
   *
   * @see https://nodejs.org/api/fs.html#fsutimessyncpath-atime-mtime
   */
  utimesSync: typeof fs.utimesSync;
  /**
   * Synchronously writes data to a file, replacing the file if it already exists.
   *
   * @see https://nodejs.org/api/fs.html#fswritefilesyncfile-data-options
   */
  writeFileSync: typeof fs.writeFileSync;
  /**
   * Writes a buffer or string to the file specified by `fd` synchronously, returning the number of bytes written.
   *
   * @see https://nodejs.org/api/fs.html#fswritesyncfd-buffer-offset-length-position
   */
  writeSync: typeof fs.writeSync;
  /**
   * Writes an array of `ArrayBufferView`s to the file specified by `fd` synchronously.
   *
   * @see https://nodejs.org/api/fs.html#fswritevsyncfd-buffers-position
   */
  writevSync: typeof fs.writevSync;
}

export interface FileSystemInterface extends BaseFileSystemInterface {
  /**
   * The promise-based file system API, equivalent to the [`node:fs/promises`](https://nodejs.org/api/fs.html#promises-api) module.
   *
   * @see https://nodejs.org/api/fs.html#promises-api
   */
  promises: PromisesFileSystemInterface;
}

export type FileSystemInterfaceOptions = Partial<FileSystemInterface> & {
  /**
   * The promise-based file system API, equivalent to the [`node:fs/promises`](https://nodejs.org/api/fs.html#promises-api) module.
   *
   * @see https://nodejs.org/api/fs.html#promises-api
   */
  promises?: Partial<PromisesFileSystemInterface>;
};
