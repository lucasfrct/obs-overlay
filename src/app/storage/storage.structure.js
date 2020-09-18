
class Lower {
    active = false
    title =  ""

    // mount element
    element =  { x: 0, y: 0, size: 100, type: "", color: "", src: "", }
    
    elementFocus = { ...this.element }
    elements = [ ...this.element ]
}

class Collection {
    active = false
    title = ""
    effect = { type: "slide", speed: 600, }
    lowers = [ ...Lower ]

    control = {          // controls interactions witch lower
        onAir: false,   // go/On Ar
        preview: false, // show selected element in preview
        open: false,    // window add/edit (modal)
        resize: false,  // reize preview
        lowerFocus: {},
        update: { subscribe: [], history: [] },
    }
}


