import path from 'path';
import fs from 'fs';

export function getTemplate(templateName: string, data: any) { // TODO: Add data type

    const templates = fs.readdirSync(__dirname).filter(name => (/^.+(\.html)$/i.test(name)));
    const templatePath = path.join(__dirname, templateName) + '.html';

    if (!templates.includes(templateName + '.html'))
        throw new Error(`Could not find template - ${templateName} : ${path.join(__dirname, templateName)}.html`);

    let template = fs.readFileSync(templatePath,{encoding: 'utf-8'});

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const value = data[key];
            const regEx = new RegExp('{{ +' + key + ' +}}','ig');

            template = template.replace(regEx, value);
        }
    }

    return template;
};