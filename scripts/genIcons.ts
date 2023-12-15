import fs from 'node:fs'
import path from 'node:path'
import camelcase from 'camelcase'

const icons = fs.readdirSync(path.resolve(__dirname, '..', 'src', 'assets', 'icons'))
console.log(icons)
function componentName(str: string) {
    return camelcase(str.split('.')[0], {
        pascalCase: true,
        preserveConsecutiveUppercase: true,
    })
}
const str = icons
    .filter(i => i.endsWith('.svg'))
    .map(i => `import ${componentName(i)} from '~icons/assets-icons/${i.split('.')[0]}';`)
    .join('\n')

const exportStr = `export {\n${icons
    .filter(i => i.endsWith('.svg'))
    .map((i) => {
        return `    ${componentName(i)},`
    })
    .join('\n')}\n}\n`

const data = str.concat('\n', exportStr)

fs.writeFile(
    path.resolve(__dirname, '..', 'src', 'icon.ts'),
    data,
    {
        flag: 'w',
    },
    () => {},
)
