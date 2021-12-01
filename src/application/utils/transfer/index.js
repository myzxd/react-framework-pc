import { TransferUtils, TransferClass, TransferDocument } from './core';

// 服务费相关的对象转换
class TransferLoaderForSalary {

  static files = () => {
    return [
      TransferUtils.loadYml('./assets/yml/model_schema/payroll/payroll_adjustment.yml'),
      TransferUtils.loadYml('./assets/yml/model_schema/payroll/payroll_plan.yml'),
      TransferUtils.loadYml('./assets/yml/model_schema/payroll/payroll.yml'),
      TransferUtils.loadYml('./assets/yml/model_schema/salary/salary_compute.yml'),
      // TransferUtils.loadYml('./assets/yml/model_schema/salary/salary_rule_field.yml'),
      TransferUtils.loadYml('./assets/yml/model_schema/salary/salary_rule.yml'),
      TransferUtils.loadYml('./assets/yml/model_schema/salary/salary_var.yml'),
      TransferUtils.loadYml('./assets/yml/model_schema/staff/staff_tag.yml'),
    ];
  }

  // 转换yml文件内容为
  static transfer = () => {
    // 汇总所有文件内容
    let data = [];
    TransferLoaderForSalary.files().forEach((item) => {
      data = data.concat(item);
    });

    // console.log('yml转json', data);

    // 格式化对象
    const objects = [];
    data.forEach((item) => {
      const object = {
        desc: item.description,
        obj: TransferUtils.pascalize(item.name),
        struct: item.schema.map((struct) => {
          return {
            desc: struct.note,
            field: struct.name,
            required: struct.required,
            type: struct.type,
          };
        }),
      };
      objects.push(object);
    });
    // console.log('json格式化', objects);

    // 输出文件
    const output = [];
    // 导出头部文件定义
    output.push(TransferClass.renderImport([objects]));

    // 导出引用
    output.push('import CoreObject from \'./core\';\n');
    // 导出对象
    objects.forEach((model) => {
      output.push(TransferClass.renderObjectToClass(model));
    });
    // 导出exports定义
    output.push(TransferClass.renderExports([objects]));

    // console.log('结果', output);
    return output;
  }

}

// OA相关的对象转换
class TransferLoaderForExpense {
  static files = () => {
    return [
//      require('./assets/json/oaModel'),
      require('./assets/json/foreignModel'),
    ];
  }

  static transfer = () => {
    const files = TransferLoaderForExpense.files();
    const output = [];
    // 导出头部文件定义
    output.push(TransferClass.renderImport(files));

    // 导出引入文件
    output.push('import CoreObject from \'./core\';\n');
    files.forEach((models) => {
      models.forEach((model) => {
        output.push(TransferClass.renderObjectToClass(model));
      });
    });
    output.push(TransferClass.renderExports(files));
    return output;
  }
}

// 服务费相关的扩展对象转换
class TransferLoaderForSalaryRelate {
  static files = () => {
    return [
      require('./assets/json/financeModel'),
    ];
  }

  static transfer = () => {
    const files = TransferLoaderForSalaryRelate.files();
    const output = [];
    // 导出头部文件定义
    output.push(TransferClass.renderImport(files));

    // 导出引入文件
    output.push('import CoreObject from \'./core\';\n');
    files.forEach((models) => {
      models.forEach((model) => {
        output.push(TransferClass.renderObjectToClass(model));
      });
    });
    output.push(TransferClass.renderExports(files));
    return output;
  }
}

// 服务费相关的文档对象转换
class TransferLoaderForSalaryDocument {

  static files = () => {
    return [
      TransferUtils.loadYml('./assets/yml/api_schema/payroll/payroll_adjustment_item.yml'),
      TransferUtils.loadYml('./assets/yml/api_schema/payroll/payroll_adjustment_task.yml'),
      TransferUtils.loadYml('./assets/yml/api_schema/payroll/payroll_plan.yml'),
      TransferUtils.loadYml('./assets/yml/api_schema/payroll/payroll_statement.yml'),
      TransferUtils.loadYml('./assets/yml/api_schema/payroll/payroll.yml'),
      TransferUtils.loadYml('./assets/yml/api_schema/salary/salary_compute_task.yml'),
      TransferUtils.loadYml('./assets/yml/api_schema/salary/salary_plan_rule_collection.yml'),
      TransferUtils.loadYml('./assets/yml/api_schema/salary/salary_plan_version.yml'),
      TransferUtils.loadYml('./assets/yml/api_schema/salary/salary_plan.yml'),
      TransferUtils.loadYml('./assets/yml/api_schema/salary/salary_rule_var.yml'),
      TransferUtils.loadYml('./assets/yml/api_schema/salary/salary_rule.yml'),
      TransferUtils.loadYml('./assets/yml/api_schema/staff/staff_tag.yml'),
    ];
  }

  static transfer = () => {
    const files = TransferLoaderForSalaryDocument.files();
    return TransferDocument.renderApi(files);
  }
}


export {
  TransferLoaderForExpense,
  TransferLoaderForSalary,
  TransferLoaderForSalaryRelate,
  TransferLoaderForSalaryDocument,
};
