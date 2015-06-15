##This is Gulp-task for personal used

This repo will do all the stuff for scaffolding a fresh projects to be watch by Gulp Task Runner. Simply by installing a node grunt-cli packages.

######Install gulp as global
```
$ npm install gulp
```

| Task |Details     |
| :------------- | :------------- |
| Gulp (Default)  |    Dev Watching and Debuging    |
| Build |   Deploy for final version    |
| Clean  |   Clear Dist folder after build    |

######Mini Task include:
| Mini Task      |
| :------------- |
| Stylus         |
| Sass & Compass |
| Imgmin         |
| Uglify         |
| CSSMin         |
| browserSync    |
| Rupture (Media)|
| Nib / koutoSwiss|
Source Maps included.

####Below is a script files need to be add inside tilter path for bash.
For a better work flow of development, it's nice to have a default running task to be declare in a function inside the bash profile.
######Open the bash profile file in atom
```
$ atom ~/.bash_profile
```

######Insert the code below
```sh
function nodeBoiler {
  args=("$@")

  # clone repo
  git clone https://github.com/kangw3n/node-gulp.git ${args[0]}

  cd ${args[0]}

  # remove git repo
  # rm -rf .git

  #git init
  # git init

  #npm install
  npm install

  #bower install
  # bower install

}


```
Now we can always clone a grunt boilerplates and run all the npm install command in a single steps.
######Clone and install all dependency in 1 code.
```
$ nodeBoiler NAMEOFTHEFOLDER
```


Copyright (c) 2015 Copyright kangw3n All Rights Reserved.
