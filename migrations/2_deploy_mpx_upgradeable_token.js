// migrations/NN_deploy_upgradeable_box.js
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const MindplexUpgradeableToken = artifacts.require('MindplexUpgradeableToken');

module.exports = async function (deployer) {
  const instance = await deployProxy(MindplexUpgradeableToken, ["MindplexToken","MPX"], { deployer });
  console.log('Deployed', instance.address);
};