import { Router } from "express";

export default async () => {
  return new Promise<Router>(async (resolve) => {
    const router = Router();

    // 获取appState "/:appStateId" "get"
    router.get(
      "/:appStateId",
      common.verify(
        "params",
        common.joi.object().keys({
          // appStateId: common.joi
          //   .number()
          //   .empty("")
          //   .default(0)
          //   .integer()
          //   .min(1)
          //   .custom((value: number) => --value)
          //   .error(new Error("current 不符合验证格式"))
        })
      ),
      async (req, res) => {
        const { appStateId } = req.params;
        const appState = Buffer.from(
          encodeURIComponent(common.cache.appState[appStateId] || "{}")
        ).toString("base64");
        res.send(`appState='${appState}'`);
      }
    );
    await common.loadRouter(
      router,
      common.path(common.__dirname(import.meta.url))
    );
    resolve(router);
  });
};
