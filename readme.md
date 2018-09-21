## Create css files
`npm run build`

## Customize output folder

`npm run build --  --output='../css'`

## Start sass watch (not active by default)
`npm run build -- --watch`

## Deactivate sourcemaps default is true
`npm run build -- --sourcemaps=false`

## Deactivate compression
`npm run build -- --compress=false`

## Build with gzip
`npm run build -- --gzip`

## change output filename
`npm run build -- --filename=main.css`

# Combine them!
`npm run build -- --gzip --compress=false --souremap=false --ouput=../ filename=main.css`

# Usage of fluent-css
 
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

<div class="margin-percent mb-14 ml-14-important">
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
## Example for margin
![alt text](./img/margin.gif)

# Example for padding
![alt text](./img/position.gif)