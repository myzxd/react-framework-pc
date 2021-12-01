import { Base64 } from 'js-base64';
import yaml from 'js-yaml';
import format from './library/format';

// 工具类
class TransferUtils {
  // 加载yml文件
  static loadYml = (file = '') => {
    try {
      const fileContent = require(`${file}`);

      // 判断文件内容是否为孔
      if (!fileContent) {
        // console.log(`yml文件内容为空:${file}`);
        return {};
      }

      // 解析md文件，base64反编译
      const regex = /data:text\/yaml;base64,(.*)/;
      const matches = regex.exec(fileContent);
      if (!matches) {
        // console.log(`yml文件内容解析失败:${file}`);
        return {};
      } else {
        const doc = yaml.safeLoad(Base64.decode(matches[1]));
        // console.log(doc);
        return doc;
      }
    } catch (e) {
      // console.log(`yml文件解析出错:${file}\n`, e);
      return {};
    }
  }

  // 将数据类型转换为值
  static transferJsonTypeToValue = (type) => {
    switch (type) {
      case 'str': return '\'\'';
      case 'string': return '\'\'';
      case 'int': return 0;
      case 'integer': return 0;
      case 'None': return undefined;
      case 'ObjectId': return undefined;
      case 'object_id': return undefined;
      case 'datetime': return undefined;
      case '[ObjectId]': return '[]';
      case '[object_id]': return '[]';
      case '[basestring]': return '[]';
      case '[string]': return '[]';
      case '[dict]': return '[]';
      case 'list': return '[]';
      case 'dict': return '{}';
      case 'bool': return false;
      case 'PayeeInfoSchema.structure': return '{}';
      case '{\'key\':\'value\'}': return '{}';
      case 'embed_object': return '{}';
      case 'Foreign': return undefined;   // 外键对象（自定义）
      case '[Foreign]': return '[]';      // 外键对象数组（自定义）
      default: return undefined;
    }
  }

  // 小驼峰
  static camelize = (string) => {
    return format.camelize(string);
  }

  // 大驼峰
  static pascalize = (string) => {
    return format.pascalize(string);
  }

}

// 将对象转换为类定义
class TransferClass {

  // 映射格式转换
  static transferDatamap = (struct) => {
    const datamap = {};
    struct.forEach((item) => {
      // 转换外键形式
      if (item.type === 'Foreign' || item.type === '[Foreign]') {
        datamap[item.field] = item;
      } else {
        // 转换驼峰形式
        const camelizeField = TransferUtils.camelize(item.field);
        datamap[item.field] = camelizeField;
      }
    });
    return datamap;
  }

  // 反向映射格式转换
  static transferRevertMap = (struct) => {
    const datamap = {};
    struct.forEach((item) => {
      // 转换外键形式
      if (item.type === 'Foreign' || item.type === '[Foreign]') {
        datamap[item.field] = item;
      } else {
        // 转换驼峰形式
        const camelizeField = TransferUtils.camelize(item.field);
        datamap[camelizeField] = item.field;
      }
    });
    return datamap;
  }

  // 必填字段格式转换
  static transferRequiredFields = (struct) => {
    return struct.filter(item => item.required === true);
  }

  // 外键格式转换（目前没有关系定义，不转换）
  static transferForeignKey = () => {
    // CoreObject.mapper
    // CoreObject.mapperEach
    // CoreObject.revert
    // CoreObject.revertEach
  }

  // 将json渲染为string
  static transferFieldsToTemplateWithRender = (fields, render = () => '', space = 2) => {
    const keys = Object.keys(fields);
    let template = '';
    keys.forEach((key, index) => {
      // 数值
      const value = fields[key];

      // 不是首行，添加缩进
      if (index !== 0) {
        template += `${' '.repeat(space)}`;
      }

      // 添加展示数据
      template += render(key, value);

      // 不是最后一行，添加换行
      if (index !== keys.length - 1) {
        template += '\n';
      }
    });
    return template;
  }

  // 渲染Constructor
  static renderConstructor = (key, value) => {
    const defaultValue = TransferUtils.transferJsonTypeToValue(value.type);
    // 初始化语句
    const string = `this.${TransferUtils.camelize(value.field)} = ${defaultValue};`;
    // 填充对齐注释
    return `${string.padEnd(44, ' ')}// ${value.desc}`;
  }

  // 渲染数据映射
  static renderDataMap = (key, value) => {
    // 外键
    if (value.type === 'Foreign') {
      return `'${key}': {
        key: '${TransferUtils.camelize(key)}',
        transform: value => CoreObject.mapper(value, ${value.relate}),
      },`;
    }

    // 外键数组
    if (value.type === '[Foreign]') {
      return `'${key}': {
        key: '${TransferUtils.camelize(key)}',
        transform: value => CoreObject.mapperEach(value, ${value.relate}),
      },`;
    }

    // 正常的key：value结构
    return `'${key}': '${value}',`;
  }

  // 渲染反向映射
  static renderRevertMap = (key, value) => {
    // 外键
    if (value.type === 'Foreign') {
      return `'${TransferUtils.camelize(key)}': {
        key: '${key}',
        transform: value => CoreObject.revert(value, ${value.relate}),
      },`;
    }

    // 外键数组
    if (value.type === '[Foreign]') {
      return `'${TransferUtils.camelize(key)}': {
        key: '${key}',
        transform: value => CoreObject.revertEach(value, ${value.relate}),
      },`;
    }

    return `'${key}': '${value}',`;
  }

  // 渲染必填字段
  static renderRequiredFields = (key, value) => {
    return `${`'${TransferUtils.camelize(value.field)}',`.padEnd(30, ' ')}// ${value.desc}`;
  }

  // 渲染模版
  static renderObjectToClass = (model) => {
    // 类对象
    const className = model.obj;
    // 类描述
    const classDesc = model.desc;
    // 类字段
    const classStruct = model.struct;
    // 关联对象
    const classRelate = model.relate;
    // 数据映射
    const classDataMap = TransferClass.transferDatamap(classStruct);
    // 反向数据映射
    const classRevertMap = TransferClass.transferRevertMap(classStruct);
    // 必填字段
    const classRequiredFields = TransferClass.transferRequiredFields(classStruct);

    return (`
// ${classDesc}
class ${className} extends CoreObject {
  constructor() {
    super();
    ${TransferClass.transferFieldsToTemplateWithRender(classStruct, TransferClass.renderConstructor, 4)}
  }

  // 关联的基础对象，undefined为无关联（默认底层会将datamap和revertMap结构关联）
  static relateObject() {
    return ${classRelate};
  }

  // 必填字段
  static requiredFields() {
    return [
      ${TransferClass.transferFieldsToTemplateWithRender(classRequiredFields, TransferClass.renderRequiredFields, 6)}
    ];
  }

  // 数据映射
  static datamap() {
    return {
      ${TransferClass.transferFieldsToTemplateWithRender(classDataMap, TransferClass.renderDataMap, 6)}
    };
  }

  // 反向映射
  static revertMap() {
    return {
      ${TransferClass.transferFieldsToTemplateWithRender(classRevertMap, TransferClass.renderRevertMap, 6)}
    };
  }
}\n`);
  }

  // 转换imports
  static renderImport = (objects) => {
    let output = [];
    objects.forEach((models) => {
      models.forEach((model, index) => {
        // 类对象
        const className = model.obj;
        output += className;
        // 不是最后一行，添加换行
        if (index !== models.length - 1) {
          output += ', ';
        }
      });
    });
    return `import { ${output} } from './';\n\n`;
  }

  // 转换exports
  static renderExports = (objects) => {
    let output = '';
    objects.forEach((models) => {
      models.forEach((model, index) => {
        // 类对象
        const className = model.obj;
        // 类描述
        const classDesc = model.desc;
        output += `${`  ${className},`.padEnd(40, ' ')}// ${classDesc}`;
        // 不是最后一行，添加换行
        if (index !== models.length - 1) {
          output += '\n';
        }
      });
    });
    return `
module.exports = {
${output}
};\n`;
  }

}

// 将对象转换为文档
class TransferDocument {
  static renderApi = (files) => {
    // 数据结构
    // {
    //   name: '',
    //   desc: '',
    //   path: '',
    //   module: '',
    //   params: {},
    //   result: {},
    //   sample: {
    //     params: {},
    //     result: {},
    //   },
    // },
    // console.log(files);

    const data = [];

    files.forEach((file) => {
      file.forEach((module) => {
        module.apis.forEach((apiItem) => {
          apiItem.cmd_list.forEach((cmd) => {
              // 转换api的数据结构
            data.push({
              name: cmd.summary,
              desc: cmd.description,
              path: `${apiItem.api_ns}.${cmd.cmd}`,
              module: module.module,
              params: cmd.params,
              result: cmd.result,
              example: {
                params: cmd.param_example,
                result: cmd.result_example,
              },
            });
          });
        });
      });
    });
    // console.log(data);
    return data;
  }
}

export {
  TransferUtils,
  TransferClass,
  TransferDocument,
};
