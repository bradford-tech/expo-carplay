import { type ConfigPlugin, createRunOncePlugin } from 'expo/config-plugins';

import { withCarPlayEntitlements } from './withCarPlayEntitlements';
import { withCarPlayInfoPlist } from './withCarPlayInfoPlist';

const pkg = require('../../package.json');

const withExpoCarPlay: ConfigPlugin = config => {
  config = withCarPlayInfoPlist(config);
  config = withCarPlayEntitlements(config);
  return config;
};

export default createRunOncePlugin(withExpoCarPlay, pkg.name, pkg.version);
