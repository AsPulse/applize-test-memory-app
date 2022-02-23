const { resolve, basename } = require('path');
const { ApplizeBuilder, ApplizeProjectMakeUp } = require('@aspulse/applize');
const UglifyJS = require("uglify-js");
const { readFile, writeFile } = require('fs/promises');


const uglify = toplevel => ({
  name: 'UglifyJS',
  compiler: async path => {
    const result = UglifyJS.minify({[basename(path)]: (await readFile(path)).toString()}, {
      toplevel,
      compress: {
        hoist_funs: true,
        passes: 5,
        unsafe: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true
      }
    })
    if(result.error) { console.log(result.error); return false; }
    if(result.warning) { console.log(result.warnings); return false; }
    await writeFile(path, result.code);
    return true;
  }
});

const builder = new ApplizeBuilder();
ApplizeProjectMakeUp(builder, {
    serverEntryPoint: resolve(__dirname, 'src/index.ts'),
    pagesDirectory: resolve(__dirname, 'pages'),
    distDirectory: resolve(__dirname, 'dist'),
    entryHTML: resolve(__dirname, 'entry', 'index.html'),
    entryTS: resolve(__dirname, 'entry', 'index.ts'),
    pagesPostBuilder: [
      uglify(false)
    ]
});

builder.run();
