import router from 'koa-router';
import Util from '../util/util';
import log4js from '../log4js';
const log = log4js.getLogger('DEBUG');
const IndexRouter = router();
import { UserService } from '../service';
import { UserFacade} from '../facade';
import REGULAR from "../const/regular";

IndexRouter.get('/info', (ctx, next) => {
  // let baseUrl = Util.getBaseUrlByServiceName(ctx.params.serviceName);
  ctx.body = '{"status":"UP"}';
});
IndexRouter.get('/swagger-ui.html', (ctx, next) => {
  ctx.redirect("/swagger-ui/index.html");
});
export default IndexRouter;