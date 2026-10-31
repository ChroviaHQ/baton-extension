import { registerProxyAuth } from './proxyAuth';
import { registerProxyController } from './proxyController';
import { registerRequestRecorder } from './requestRecorder';

registerProxyController();
registerRequestRecorder();
registerProxyAuth();
