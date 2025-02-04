/*-------------------------------------------------------------------

                       ⚡ Storm Software - Stryke

 This code was released as part of the Stryke project. Stryke
 is maintained by Storm Software under the Apache-2.0 License, and is
 free for commercial and private use. For more information, please visit
 our licensing page.

 Website:         https://stormsoftware.com
 Repository:      https://github.com/storm-software/stryke
 Documentation:   https://stormsoftware.com/projects/stryke/docs
 Contact:         https://stormsoftware.com/contact
 License:         https://stormsoftware.com/projects/stryke/license

 -------------------------------------------------------------------*/

// Based on https://github.com/puleos/object-hash v3.0.0 (MIT)

export interface HashObjectOptions {
  /**
   * Function to determine if a key should be excluded from hashing.
   *
   * @param key - The key to check for exclusion.
   * @returns Returns true to exclude the key from hashing.
   */
  excludeKeys?: ((key: string) => boolean) | undefined;

  /**
   * Specifies whether to exclude values from hashing, so that only the object keys are hashed.
   *
   */
  excludeValues?: boolean | undefined;

  /**
   * Specifies whether to ignore objects of unknown type (not directly serialisable) when hashing.
   *
   * @defaultValue false
   */
  ignoreUnknown?: boolean | undefined;

  /**
   * A function that replaces values before they are hashed, which can be used to customize the hashing process.
   *
   * @param value - The current value to be hashed.
   * @returns The value to use for hashing instead.
   */
  replacer?: ((value: any) => any) | undefined;

  /**
   * Specifies whether the 'name' property of functions should be taken into account when hashing.
   *
   * @defaultValue false
   */
  respectFunctionNames?: boolean | undefined;

  /**
   * Specifies whether properties of functions should be taken into account when hashing.
   *
   * @defaultValue false
   */
  respectFunctionProperties?: boolean | undefined;

  /**
   * Specifies whether to include type-specific properties such as prototype or constructor in the hash to distinguish between types.
   *
   * @defaultValue false
   */
  respectType?: boolean | undefined;

  /**
   * Specifies whether arrays should be sorted before hashing to ensure consistent order.
   *
   * @defaultValue false
   */
  unorderedArrays?: boolean | undefined;

  /**
   * Specifies whether Set and Map instances should be sorted by key before hashing to ensure consistent order.
   *
   * @defaultValue true
   */
  unorderedObjects?: boolean | undefined;

  /**
   * Specifies whether the elements of `Set' and keys of `Map' should be sorted before hashing to ensure consistent order.
   *
   * @defaultValue false
   */
  unorderedSets?: boolean | undefined;
}

// Defaults
const defaults: HashObjectOptions = Object.freeze({
  ignoreUnknown: false,
  respectType: false,
  respectFunctionNames: false,
  respectFunctionProperties: false,
  unorderedObjects: true,
  unorderedArrays: false,
  unorderedSets: false,
  excludeKeys: undefined,
  excludeValues: undefined,
  replacer: undefined
});

/**
 * Serialize any JS value into a stable, hashable string
 *
 * @param object - value to hash
 * @param options - hashing options. See {@link HashObjectOptions}.
 * @returns serialized value
 */
export function hashObject(object: any, options?: HashObjectOptions): string {
  options = options
    ? {
        ...defaults,
        ...options
      }
    : defaults;
  const hasher = createHasher(options);
  hasher.dispatch(object);
  return hasher.toString();
}

const defaultPrototypesKeys = Object.freeze([
  "prototype",
  "__proto__",
  "constructor"
]);

function createHasher(options: HashObjectOptions) {
  let buff = "";
  let context = new Map();
  const write = (str: string) => {
    buff += str;
  };

  return {
    toString() {
      return buff;
    },
    getContext() {
      return context;
    },
    dispatch(value: any): string | void {
      if (options.replacer) {
        value = options.replacer(value);
      }
      const type = value === null ? "null" : typeof value;

      return this[type](value);
    },
    object(object: any): string | void {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }

      const objString = Object.prototype.toString.call(object);

      let objType = "";
      const objectLength = objString.length;

      // '[object a]'.length === 10, the minimum
      objType =
        objectLength < 10
          ? "unknown:[" + objString + "]"
          : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();

      let objectNumber = context.get(object);
      if (objectNumber === undefined) {
        context.set(object, context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }

      if (
        typeof Buffer !== "undefined" &&
        Buffer.isBuffer &&
        Buffer.isBuffer(object)
      ) {
        write("buffer:");
        return write(object.toString("utf8"));
      }

      if (
        objType !== "object" &&
        objType !== "function" &&
        objType !== "asyncfunction"
      ) {
        // @ts-ignore
        if (this[objType]) {
          // @ts-ignore
          this[objType](object);
        } else if (!options.ignoreUnknown) {
          this.unknown(object, objType);
        }
      } else {
        let keys = Object.keys(object);
        if (options.unorderedObjects) {
          keys = keys.sort();
        }
        let extraKeys = [] as readonly string[];
        // Make sure to incorporate special properties, so Types with different prototypes will produce
        // a different hash and objects derived from different functions (`new Foo`, `new Bar`) will
        // produce different hashes. We never do this for native functions since some seem to break because of that.
        if (options.respectType !== false && !isNativeFunction(object)) {
          extraKeys = defaultPrototypesKeys;
        }

        if (options.excludeKeys) {
          keys = keys.filter(key => {
            return !options.excludeKeys!(key);
          });
          extraKeys = extraKeys.filter(key => {
            return !options.excludeKeys!(key);
          });
        }

        write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key: string) => {
          this.dispatch(key);
          write(":");
          if (!options.excludeValues) {
            this.dispatch(object[key]);
          }
          write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    },
    array(arr: any, unordered: boolean): string | void {
      unordered = unordered ?? options.unorderedArrays !== false; // default to options.unorderedArrays

      write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }

      // The unordered case is a little more complicated: since there is no canonical ordering on objects,
      // i.e. {a:1} < {a:2} and {a:1} > {a:2} are both false,
      // We first serialize each entry using a PassThrough stream before sorting.
      // also: we can’t use the same context for all entries since the order of hashing should *not* matter. instead,
      // we keep track of the additions to a copy of the context and add all of them to the global context when we’re done
      const contextAdditions = new Map();
      const entries = arr.map((entry: any) => {
        const hasher = createHasher(options);
        hasher.dispatch(entry);
        for (const [key, value] of hasher.getContext()) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    },
    date(date: any) {
      return write("date:" + date.toJSON());
    },
    symbol(sym: any) {
      return write("symbol:" + sym.toString());
    },
    unknown(value: any, type: string) {
      write(type);
      if (!value) {
        return;
      }
      write(":");
      if (value && typeof value.entries === "function") {
        return this.array([...value.entries()], true /* ordered */);
      }
    },
    error(err: any) {
      return write("error:" + err.toString());
    },
    boolean(bool: any) {
      return write("bool:" + bool);
    },
    string(string: any) {
      write("string:" + string.length + ":");
      write(string);
    },
    function(fn: any) {
      write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }

      if (options.respectFunctionNames !== false) {
        // Make sure we can still distinguish native functions
        // by their name, otherwise String and Function will
        // have the same hash
        this.dispatch("function-name:" + String(fn.name));
      }

      if (options.respectFunctionProperties) {
        this.object(fn);
      }
    },
    number(number: any) {
      return write("number:" + number);
    },
    xml(xml: any) {
      return write("xml:" + xml.toString());
    },
    null() {
      return write("Null");
    },
    undefined() {
      return write("Undefined");
    },
    regexp(regex: any) {
      return write("regex:" + regex.toString());
    },
    uint8array(arr: any) {
      write("uint8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint8clampedarray(arr: any) {
      write("uint8clampedarray:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int8array(arr: any) {
      write("int8array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint16array(arr: any) {
      write("uint16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int16array(arr: any) {
      write("int16array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    uint32array(arr: any) {
      write("uint32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    int32array(arr: any) {
      write("int32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    float32array(arr: any) {
      write("float32array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    float64array(arr: any) {
      write("float64array:");
      return this.dispatch(Array.prototype.slice.call(arr));
    },
    arraybuffer(arr: any) {
      write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    },
    url(url: any) {
      return write("url:" + url.toString());
    },
    map(map: any) {
      write("map:");
      const arr = [...map];

      return this.array(arr, options.unorderedSets !== false);
    },
    set(set: any) {
      write("set:");
      const arr = [...set];

      return this.array(arr, options.unorderedSets !== false);
    },
    file(file: any) {
      write("file:");
      return this.dispatch([file.name, file.size, file.type, file.lastModfied]);
    },
    blob() {
      if (options.ignoreUnknown) {
        return write("[blob]");
      }
      throw new Error(
        "Hashing Blob objects is currently not supported\n" +
          'Use "options.replacer" or "options.ignoreUnknown"\n'
      );
    },
    domwindow() {
      return write("domwindow");
    },
    bigint(number: number) {
      return write("bigint:" + number.toString());
    },
    /* Node.js standard native objects */
    process() {
      return write("process");
    },
    timer() {
      return write("timer");
    },
    pipe() {
      return write("pipe");
    },
    tcp() {
      return write("tcp");
    },
    udp() {
      return write("udp");
    },
    tty() {
      return write("tty");
    },
    statwatcher() {
      return write("statwatcher");
    },
    securecontext() {
      return write("securecontext");
    },
    connection() {
      return write("connection");
    },
    zlib() {
      return write("zlib");
    },
    context() {
      return write("context");
    },
    nodescript() {
      return write("nodescript");
    },
    httpparser() {
      return write("httpparser");
    },
    dataview() {
      return write("dataview");
    },
    signal() {
      return write("signal");
    },
    fsevent() {
      return write("fsevent");
    },
    tlswrap() {
      return write("tlswrap");
    }
  };
}

const nativeFunc = "[native code] }";
const nativeFuncLength = nativeFunc.length;

/** Check if the given function is a native function */
function isNativeFunction(f: any) {
  if (typeof f !== "function") {
    return false;
  }
  return (
    Function.prototype.toString.call(f).slice(-nativeFuncLength) === nativeFunc
  );
}
