class Collection {
    active = false
    title = ""
    effect = { type: "slide", speed: 600, }
    lowers = []

    control = {          // controls interactions witch lower
        onAir: false,   // go/On Ar
        preview: false, // show selected element in preview
        open: false,    // window add/edit (modal)
        resize: false,  // reize preview
        lowerFocus: {},
        update: { subscribe: [], history: [] },
    }
}
