import Request from "./Request";
import type { AxiosRequestConfig } from "axios";
import type {
  RequestItem
} from "types/Request";

export default class AxiosFactory extends Request {

  private RequestConfigMap:any = {};
  static instance:AxiosFactory;

  constructor(config: AxiosRequestConfig) { 
    super(config);
    if (AxiosFactory.instance === undefined) {
      AxiosFactory.instance = this;
    }
    return AxiosFactory.instance;
  };

  public setConfig(name: string, requestConfigs: RequestItem[]): void { 
    this.RequestConfigMap[name] = requestConfigs;
  };

  public create(name: string): any {
    const { RequestConfigMap } = this;
    const requestConfigs = RequestConfigMap[name];
    let methodsMap: any = {};
    if (!RequestConfigMap) {
      console.error("未找到对应集合，请使用新建setConfig添加");
      return methodsMap;
    };
    for (let i = 0; i < requestConfigs.length; i++) { 
      const requestItem: RequestItem = requestConfigs[i];
      const { key = "" } = requestItem;
      const fn = this.createMethod(requestItem);
      methodsMap[key] = fn;
    }
    return methodsMap;
  };

};
