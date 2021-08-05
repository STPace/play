# play-yalc

[yalc](https://github.com/wclr/yalc)

```sh
# 创建 lib-a 及 lib-b
mkdir packages
cd packages
tsdx create lib-a
tsdx create lib-b

# 本地发布 lib-a
cd lib-a
yalc publish

# lib-b 中添加 lib-a 依赖
cd ../lib-b
yalc add lib-a --link

# 展示当前安装的所有包
yalc installations show

cd ../lib-a
# 修改代码后发布，--push 会自动触发 lib-a 的更新
yalc publish --push

# 从 package.json 中移除包
yalc remove <package>
```
