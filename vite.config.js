import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig, loadEnv } from 'vite'
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const file = fileURLToPath(new URL('package.json', import.meta.url));
const json = readFileSync(file, 'utf8');
const pkg = JSON.parse(json);
// import { injectStylusBreakpoints } from "@azt/responsive/vite"

import path from 'path'

import BREAKPOINTS from "./src/lib/breakpoints.json"

function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, '_$1')
    .replace(/[\s\-]+/g, '_')
    .toLowerCase()
    .replace(/^_/, '');
}

const injectStylusBreakpoints = (options={}) => {
  return {
    name: 'vite-plugin-stylus-breakpoints',
    enforce: 'pre',
    transform(code,filePath,config) {
      const _ext = path.extname(filePath)
      let _code = code
      if(_ext === '.styl') {
        const {
          breakpoints:_breakpoints = (BREAKPOINTS || process.env.BREAKPOINTS || global.BREAKPOINTS || {})
        } = options
        const _mediaQueries = Object.keys(_breakpoints).reduce((str,key)=> {
          const _bp = _breakpoints?.[key]
          let _mediaQuery = `_${toSnakeCase(key)} = '`
          let _mediaQueryArray = []
          const _minWidth = Array.isArray(_bp.width) ? _bp.width[0] : _bp.width
          const _maxWidth = _bp.width?.[1]
          if(_minWidth)
            _mediaQueryArray.push(`(min-width: ${_minWidth}px)`)
          if(_maxWidth)
            _mediaQueryArray.push(`(max-width: ${_maxWidth}px)`)
          if(_bp.touch !== undefined)
            _mediaQueryArray.push(`(any-pointer: ${_bp.touch ? 'coarse' : 'fine'})`)
          if(_bp.hover !== undefined)
            _mediaQueryArray.push(`(any-hover: ${_bp.hover ? 'hover' : 'none'})`)
          if(_bp.portrait !== undefined || _bp.landscape !== undefined)
            _mediaQueryArray.push(`(orientation: ${_bp.portrait ? 'portrait' : ''}${_bp.portrait && _bp.landscape ? ',' : ''}${_bp.landscape ? 'landscape' : ''})`)
          _mediaQuery += `${_mediaQueryArray.join(' and ')}'`
          return str += `\n${_mediaQuery}`
        },'')
        _code = `${_mediaQueries}\n${code}`
      }
      return {
        code: _code,
        map: null, // Not needed, right?
      }
    }
  }
}

export default ({ mode })=> {
  return defineConfig({
    plugins: [
      sveltekit(),
      // devtoolsJson(),
      injectStylusBreakpoints({
        breakpoints: BREAKPOINTS,
      }),
    ],
  	resolve: {
		  alias: {
			  '|': path.resolve(__dirname, 'src')
		  }
	  },
    define: {
      PKG: pkg
    }
  })
}

