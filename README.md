# Nestjs 通用后台管理系统 - 后端


## 启动项目

```
pnpm install // 下载依赖

pnpm run start:dev // 启动项目
```


### husky 使用步骤
```shell
pnpm i husky -D # 下载 husky

pnpx husky install # 启用 git hooks
```

加入 husky prepare 命令
- 在 `package.json` 的 `scripts` 里加上如下命令:
```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

添加 Hook
```shell
pnpx husky add .husky/_/pre-commit "pnpm test"

git add .husky/pre_commit
```

```shell
pnpm exec lint-staged # 使用 lint-staged
```

版本更新

```shell
npx mrm@2 lint-staged

pnpm i husky lint-staged -D # pnpm

```