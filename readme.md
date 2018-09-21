﻿# create css files
`npm run build`

customize output folder

`npm run build --  --output='../css';`

# usage of fluent-css
 
 ## to import fluent-css, simply copy this line in your scss stylesheet
```scss
@import 'fluent-css'; // absolute path from your stylesheet e.g. -> ./sass/fluent-styles/fluent-styles;
```

## or import only the package you need
```scss
@import 'fluent-css/display';
```

## padding and margin
```html
<div class="padding-px pb-14 pl-14">
	...
</div>

<div class="margin-pc mb-14 ml-14-important">
	...
</div>
```
## Style behind
```scss
.padding-px { 
   &.pb-1 {
      padding-bottom: 1px;
   }

   &.pb-1-important {
      padding-bottom: 1px !important;
   }

   // also with minus for margin (invalid for padding!)
   &.mb-neg-1 {
      margin-bottom: -1px;
   }
}
```

## Available units:
```
px, percent, em, rem
```

# everything else is fluent

```html
<div class="display-inline-block">
	<!-- easy! right? -->
</div>
```

## Available classes

```scss

.display
.position
.


```

