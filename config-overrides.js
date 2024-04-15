const { override, fixBabelImports, addLessLoader } = require('customize-cra')

module.exports = override(fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      '@primary-color': '#1DA57A', // primary color for all components
      '@link-color': '#1890ff', // link color
      '@success-color': '#52c41a', // success state color
      '@warning-color': '#faad14', // warning state color
      '@error-color': '#f5222d', // error state color
      '@font-size-base': '14px', // major text font size
      '@heading-color': 'rgba(255, 255, 255, 0.85)', // heading text color
      '@text-color': 'rgba(255, 255, 255, .65)', // major text color
      '@text-color-inverse': '#282c34',
      '@text-color-secondary' : 'rgba(255, 255, 255, .45)', // secondary text color
      '@disabled-color' : 'rgba(255, 255, 255, .25)', // disable state color
      '@border-radius-base': '4px', // major border radius
      '@border-color-base': '#d9d9d9', // major border color
      '@box-shadow-base': '0 2px 8px rgba(255, 255, 255, 0.15)', // major shadow for layers,
      '@body-background': '#282c34',
      '@component-background': '#282c34',
      '@table-selected-row-bg:': '#3D4148',
      '@item-hover-bg': 'rgba(255, 255, 255, .25)',
      '@item-active-bg': 'rgba(255, 255, 255, .25)'
    },
  })
)