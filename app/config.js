import Yaml from 'yaml-config';
import path from 'path';
const CONFIG=Yaml.readConfig(path.join(__dirname, 'appliction.yml'), NODE_ENV);
//获取启动配置参数
export default CONFIG;