/**
 * 仅提供布局，与Form无关
 * 传入cols自动计算处Col的span
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form } from 'antd';

const CoreForm = ({ cols, items, ...restProps }) => {
  const renderItems = () => items.map((item) => {
    // 此处的key可以是item object里的，也可以是传给第一层组件的
    let { key, span, render, offset, ...rest } = item;

    if (!render) {
      render = item;
      rest = {};
    }

    /**
     * 关于列表key的策略
     *
     * 如果未在items里传入key，且传入的render是一个FormItem元素:
     * 那么优先取FormItem的name（同一表单name不会相同），
     * 如果没有name（纯展示的情况）， 取FormItem的label。
     * 如果不符合以上情况，取随机数。
     *
     * 建议必须手动传入key的情况：
     * 1. render未传入FormItem元素时
     * 2. 传入的是FormItem，但是没有name和label时
     * 3. 传入的是FormItem，但是没有name，且label与其他FormItem有重复时
     */
    if (!key) {
      // 若key不存在, 且render是一个FormItem组件，取组件上的name（字段key）作为key
      if (
        render.$$typeof === Symbol.for('react.element') &&
        render.type === Form.Item
      ) {
        if (render.props.name) {
          if (Array.isArray(render.props.name)) {
            key = render.props.name.join('.');
          } else {
            key = render.props.name;
          }
        } else if (render.props.label) {
          key = render.props.label;
        } else {
          // eslint-disable-next-line
          console.error('[CoreForm]: Please give a `key`, if the FormItem has no `name` or `label` prop');
        }
      } else {
        // 否则取随机数
        key = `${Math.random()}`;
      }
    }

    // 当前列布局
    if (!span) {
      span = Math.floor(24 / cols);
    }

    // 栅格左侧的间隔格数
    if (!offset) {
      offset = 0;
    }
    return (
      <Col key={key} span={span} offset={offset} {...rest}>
        {render}
      </Col>
    );
  });
  return (
    <Row {...restProps}>
      {renderItems()}
    </Row>
  );
};

CoreForm.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      // 直接传入ReactNode或renderProps
      PropTypes.oneOfType([
        PropTypes.func, // renderProps
        PropTypes.node, // react node
      ]),
      // 对象
      PropTypes.shape({
        render: PropTypes.oneOfType([ // 要渲染内容
          PropTypes.func, // renderProps
          PropTypes.node, // react node
        ]),
        key: PropTypes.string, // 列表key
      // 其它Antd Col支持的props
      }),
    ]),
  ).isRequired,
  cols: PropTypes.number, // 列数
  // 其它Antd Row支持的props
};

CoreForm.defaultProps = {
  cols: 3, // 默认3列
};

export default CoreForm;

// /**
//  * 核心布局组件
//  * 支持全局表单的自适配布局，栅格布局
//  * 所有组件的核心适配都基于此功能。需要新feature 通知 @韩健
//  */
// import is from 'is_js';
// import React from 'react';
// import { Row, Col } from 'antd';
// import PropTypes from 'prop-types';

// const CoreGrids = ({ cols, items, align, gutter, justify, wrap, isRefresh, ...props }) => {
//   /**
//    * 根据item属性，判断渲染内容。支持多种结构
//    * 判断顺序为 react组件，函数，对象中的render函数，对象中的render属性
//    * react组件                            <div>1</div>
//    * 函数（动态渲染使用）                   () => <div>2</div>
//    * 对象中的render函数(自定义属性使用)       { render: () => <div>3</div>, flex:'auto', key, ... }
//    * 对象中的render属性(自定义属性使用)       { render: <div>4</div>, flex:'auto', key, ... }
//    */
//   const renderChildren = (item) => {
//     // 如果原生组件，如果是组件，直接渲染
//     if (item.$$typeof === Symbol.for('react.element')) {
//       return item;
//     }

//     // 判断函数类型，如果是函数，直接执行
//     if (is.function(item) === true && item) {
//       return renderChildren(item());
//     }

//     // 判断item.render是否是函数类型，如果是函数，直接执行
//     if (is.object(item) && is.existy(item.render) && is.function(item.render)) {
//       return renderChildren(item.render());
//     }

//     // 判断item.render是否是函数类型，如果不是函数，直接返回
//     if (is.object(item) && is.existy(item.render) && is.not.function(item.render)) {
//       return item.render;
//     }

//     // 如果所有规则都不满足，直接返回（静态类型直接渲染，错误类型直接报错）
//     return item;
//   };

//   // 渲染内容
//   const renderItems = () => items.map((item) => {
//     const { pull, push, order, flex, style, props: itemProps = {} } = item;
//     const { name } = itemProps;
//     let { key, offset, span } = item;

//     // 没有key使用默认key
//     if (!key) {
//       key = `itemKey${Math.random()}`;

//       /*
//       * 是否使用name作为key && name不为空
//       * 注 加随机key可能会多次触发渲染 用固定nameKey会导致项目中的initialValues失效 故增加此判断
//       * */
//       if (isRefresh && name) {
//         key = `itemKey${name}`;
//       }
//     } else {
//       key = `itemKey${key}`;
//     }

//     // 当前列布局
//     if (!span) {
//       span = Math.floor(24 / cols);
//     }

//     // 如果是自动布局，则不传span（自适配布局的时候span属性会限制宽度，auto无法生效）
//     if (flex === 'auto') {
//       span = undefined;
//     }

//     // 栅格左侧的间隔格数
//     if (!offset) {
//       offset = 0;
//     }

//     // 获取要渲染的内容
//     const children = renderChildren(item);

//     return (
//       <Col key={key} span={span} offset={offset} pull={pull} push={push} order={order} flex={flex} style={style}>
//         {children}
//       </Col>
//     );
//   });
//   return (
//     <Row align={align} gutter={gutter} justify={justify} wrap={wrap} {...props}>
//       {renderItems()}
//     </Row>
//   );
// };

// // 栅格单条内容属性
// const CoreGridItem = {
//   // 渲染调用，支持函数，组件，函数嵌套（原则上只要返回值符合标准，会自动递归调用，但是不推荐）
//   render: PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.element,
//   ]).isRequired,
//   key: PropTypes.string,    // 标识key
//   style: PropTypes.object,  // 额外样式

//   // 支持col属性，下列属性说明见 https://ant.design/components/grid-cn/#Col
//   offset: PropTypes.number, // 栅格左侧的间隔格数，间隔内不可以有栅格
//   span: PropTypes.number,   // 栅格占位格数，为 0 时相当于 display: none
//   pull: PropTypes.number,   // 栅格向左移动格数
//   push: PropTypes.number,   // 栅格向右移动格数
//   order: PropTypes.number,  // 栅格顺序

//   // flex 布局属性。 注意，使用该属性后，span参数会被覆盖成undefined
//   flex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
// };

// // 栅格列表属性
// const CoreGridItems = PropTypes.arrayOf(
//   PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.element,
//     PropTypes.shape(CoreGridItem),
//   ]),
// );

// CoreGrids.propTypes = {
//   // 列数
//   cols: PropTypes.number,
//   // 渲染的内容
//   items: CoreGridItems.isRequired,

//   // 支持row属性，下列属性说明见 https://ant.design/components/grid-cn/#Row
//   align: PropTypes.string,    // 垂直对齐方式
//   gutter: PropTypes.number,   // 栅格间隔，可以写成像素值或支持响应式的对象写法来设置水平间隔 { xs: 8, sm: 16, md: 24}。或者使用数组形式同时设置 [水平间距, 垂直间距]
//   justify: PropTypes.string,  // 水平排列方式
//   wrap: PropTypes.bool,       // 是否自动换行
//   isRefresh: PropTypes.bool,       // 是否使用name作为key  注:如果用到【initialValues】并且数据为异步加载请换为【form.setFieldsValue】
// };

// CoreGrids.defaultProps = {
//   cols: 3,            // 默认3列
//   align: 'middle',    // 垂直对齐方式
//   gutter: 16,         // 栅格间隔
//   justify: 'start',   // 水平排列方式
//   wrap: true,         // 默认自动换行
//   isRefresh: false,         // 默认不使用
// };

// export default CoreGrids;

