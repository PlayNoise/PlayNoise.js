import fs from 'fs';
import path from 'path';
import marked from 'marked';
import { AllHtmlEntities as Entities } from 'html-entities';
import DocumentedMethod from './documented-method.js';

// Function definitions...

export function smokeTestMethods(data) {
  data.classitems.forEach((classitem) => {
    if (classitem.itemtype === 'method') {
      new DocumentedMethod(classitem);

      if (
        classitem.access !== 'private' &&
        classitem.file.slice(0, 3) === 'src' &&
        classitem.name &&
        !classitem.example
      ) {
        console.log(
          `${classitem.file}:${classitem.line}: ${classitem.itemtype} ${classitem.class}.${classitem.name} missing example`
        );
      }
    }
  });
}

// Other functions...

export function buildParamDocs(docs) {
  let newClassItems = {};
  let allowed = new Set(['name', 'class', 'module', 'params', 'overloads']);
  
  for (let classitem of docs.classitems) {
    if (classitem.name && classitem.class) {
      for (let key in classitem) {
        if (!allowed.has(key)) {
          delete classitem[key];
        }
      }
      if (classitem.hasOwnProperty('overloads')) {
        for (let overload of classitem.overloads) {
          if (overload.line) {
            delete overload.line;
          }
          if (overload.return) {
            delete overload.return;
          }
        }
      }
      if (!newClassItems[classitem.class]) {
        newClassItems[classitem.class] = {};
      }
      newClassItems[classitem.class][classitem.name] = classitem;
    }
  }

  const out = fs.createWriteStream(
    path.join(process.cwd(), 'docs', 'parameterData.json'),
    {
      flags: 'w',
      mode: '0644',
    }
  );
  out.write(JSON.stringify(newClassItems, null, 2));
  out.end();
}

// Other exports...
export { mergeOverloadedMethods, renderDescriptionsAsMarkdown };
