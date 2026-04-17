module.exports = function({ config }) {
  return {
    ...config,
    extra: {
      eas: {
        projectId: 'vcsa-mobile-preview',
      },
    },
  };
};
