import rp from 'request-promise';
import _ from 'lodash';
import Util from '../util/util';
import CONFIG from '../config.js';
let baseUrl = `http://${SMS.host}:${SMS.port}/${CONFIG.appName}`;