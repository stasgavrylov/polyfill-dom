(function()
{
    "use strict"

    try { new DocumentFragment }
    catch (error)
    {
        var Constructor = Object.setPrototypeOf(function()
        {
            if (!(this instanceof DocumentFragment))
                throw new TypeError

            return document.createDocumentFragment()
        },  DocumentFragment)

        Constructor.prototype = DocumentFragment.prototype
        Constructor.prototype.constructor = Constructor

        window.DocumentFragment = Constructor
    }
})()