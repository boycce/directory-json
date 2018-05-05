<div align=center>
  <h1>Directory JSON</h1>
  <h6>Converts a directory structure into JSON</h6>
</div>

## Installation

```shell
npm install directory-json --save
```

## Project Usage

```javascript
var directoryJson = require('directory-json')

directoryJson('./path/to/my/dir', function (err, res) {
  if (err) return console.error(err)
  console.log(res);
});
```

## Cli Usage

```shell
  Usage: directory-json [options] <dir>

  Converts a directory structure into JSON

  Options:

    -v, --version          output the version number
    -c, --cwd <dir>        Relative from this directory
    -r, --recurse          Recurse sub-directories
    -l, --hash-length <n>  Length of the hash to remove from key names
    -p, --prettify         Prettify the JSON output
    -h, --help             output usage information
```

## Options

#### options.cwd
Type: `String`
Default value: `'.'`

Paths are relative from this directory.

#### options.recurse
Type: `Boolean`
Default value: `true`

Whether to recurse through sub-directories.

#### options.hashLength
Type: `Number`
Default value: `0`

Length of the hash to remove from key names.

#### options.prettify
Type: `Boolean`
Default value: `false`

Whether to prettify the JSON output.

## Output
```javascript
{
  "file1": "file1.txt",
  "folder": {
    "file2": "folder/file2.txt",
    "file3": "folder/file3.txt"
  }
}
```
