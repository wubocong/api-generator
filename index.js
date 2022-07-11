import path from 'path'
import fs from 'fs'
import { JSDOM } from 'jsdom'
import prettier from 'prettier'
// import yargs from 'yargs'
// import { hideBin } from 'yargs/helpers'
// const { argv } = yargs(hideBin(process.argv))



const dom = new JSDOM(fs.readFileSync('./dom.html', { encoding: 'utf-8' }))
let code = `import { http as httpRequest } from 'ctyun-vuebase'
import { stringify } from '@ecf/common/helper/utils/JsonUtils'
export default {`

const list = Array.from(dom.window.document.querySelectorAll('.opblock-tag-section .opblock'))
list.forEach((item) => {
  const method = item.querySelector('.opblock-summary-method').textContent
  const apiPath = item.querySelector('.opblock-summary-path').dataset.path
  let params = 'params';
  let finalPath = ''
  if (method === 'GET') {
    finalPath = '`' + apiPath + '?${stringify(params)}`'
  } else if (method === 'POST') {
    finalPath = '\'' + apiPath + '\', params'
  } else if (method === 'DELETE') {
    finalPath = '`' + apiPath.replace('{', '${') + '`'
    params = apiPath.match(/\{(\w+)\}/)[1]
  }
  const funcName = method !== 'DELETE' ? path.basename(apiPath) : path.basename(path.dirname(apiPath))
  const description = item.querySelector('.opblock-summary-description').textContent
  code = code.concat(`\n// ${description} \n${funcName}\(${params}\) {\nreturn httpRequest.${method.toLowerCase()}(${finalPath})\n},`)
})
code += '}'

fs.writeFileSync('result.js', prettier.format(code, { semi: false, tabWidth: 2, trailingComma: 'none', printWidth: 140 }))