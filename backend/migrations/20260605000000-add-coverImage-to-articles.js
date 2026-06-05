"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Articles", "coverImage", {
      type: Sequelize.TEXT,
      defaultValue: "",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Articles", "coverImage");
  },
};
