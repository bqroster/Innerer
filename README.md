### Install

```
npm install innerer --save
```

### Usage
```javascript
import { createInners } from "innerer";

// in your code 
// to start monitoring your innerer elements
createInners(callback, "#element-id");
```

```javascript
// You need to destroy the listeners before leaving the document
destroyInners();
```

or

```javascript
import Innerer from "innerer";

// in your code 
Innerer.create(callback, "#element-id");

```

```javascript
// You need to destroy the listeners before leaving the document
Innerer.destroy();
```

#### Parameters
__callbak__ is invoked when document is scrolling or resizing with one argument as an object with  the information of every `inner-tag`.

__First Argument__ (type: Object)

__List of properties, types and definition__ 

###### tag property
```
  tag: {
    type: String,
    definition: Tag name defined on the data-innerer attribute, ex. <div data-innerer="tag-name"></div>  
  }
```

###### direction property
```
  direction: {
    type:String,
    definition: document scroll direction, available options: ["up", "down"]
  }
```

###### position property
```
position: {
    status: {
      type: String,
      definition: Available options ["bottom-outer", "entered", "top-outer"]
    },
    percentageInTransition: {
      type: Number
      definition: 0 means element is outside the viewport, 1 means element is inside the viewport, between 0 and 1 means element is entering or leaving the viewport [from bottom to top, or from top to bottom].
    },
    percentageInPosition: {
      type: Number,
      definition: 0 means top element is in the top of the viewport, 1 means top element is in the bottom of the viewport, 0.5 means top element is in the middle of the viewport.
    },
    percentageOutside: {
      type: Number,
      definition: 0 means top element is in the bottom or inside of the viewport, 1 means top element is one height element or greater away outside from the bottom or top of the viewport, between 0 an 1 means element top is one height element near the bottom or top of the viewport.
    } 
}
```

###### centered property
```
centered: {
    status: {
      type: String
      definition: available option: ["below_center", "above_center"]
    },
    percentage: {
      type: Number
      definition: 1 means element center y in the center of the viewport, 0 means element center is in the top or bottom of the viewport.
    }
}
```

###### clientRect property
```
clientRect: { 
    top: {
      type: Number,
      definition: same as getBoundingClientRect.top
    },
    right: {
      type: Number,
      definition: same as getBoundingClientRect.right
    },
    bottom: {
      type: Number,
      definition: same as getBoundingClientRect.bottom
    },
    left: {
      type: Number,
      definition: same as getBoundingClientRect.left
    },
    width: {
      type: Number,
      definition: same as getBoundingClientRect.width
    },
    height: {
      type: Number,
      definition: same as getBoundingClientRect.height
    }
}
```

__[querySelector]__(optional) A query selector where the innerer will start searching for `data-innerer` attributes, if not present it will start searching for `data-innerer` attributes in the whole document. 


#### Use constant values
You can import and use the constant values to make work your conditions for each Innerer

```javascript
export const DIRECTION_UP = 'up';
export const DIRECTION_DW = 'down';
export const ENTERED = 'entered';
export const TOP_OUTER = 'top-outer';
export const BOTTOM_OUTER = 'bottom-outer';
export const BELOW_CENTER = 'below_center';
export const ABOVE_CENTER = 'above_center';
```

##### In your code
````javascript
import { 
    DIRECTION_DW, 
    DIRECTION_UP,
    ENTERED,
    BOTTOM_OUTER,
    BELOW_CENTER,
    ABOVE_CENTER
} from "innerer";
````

#### Live Example

[Vuejs using Innerer package](https://dev.bqroster.com/innerer/vue/)


#### Author
Jose Burgos <jose@bqroster.com>