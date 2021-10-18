# Coding Format
[Node.js](https://nodejs.org)がインストールされていない場合は先にインストールをお願いします。  
[Node.js](https://nodejs.org)をインストール後、`gulp`をインストールしてください。  

※Windowsでコマンドを打つ場合はこちらもインストール   
[コマンドラインからGitを使う（for Windows）](https://qiita.com/taiponrock/items/632c117220e57d555099)
```shell
$ npm i -g gulp
```

`gulp`のインストールまで終わっている場合はここから
```shell
$ npm i
```

```shell
$ gulp
```

`gulp`してエラーが出る場合は`browser-sync`をインストールした後に`gulp`してみてください
```shell
$ npm i browser-sync
```

作業は`/app/`配下で行います。  
`ejs/sass/js/fonts`配下のファイルが`/dist/`に出力されます。  
スタイルガイドに関するファイルも`/dist/`に出力されるので気を付けてください。  
スタイルガイドは[http://localhost:3000/styleguide/](http://localhost:3000/styleguide/)で確認できます。
