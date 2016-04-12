(function()
{
    "use strict"

    var $ = Element.prototype

    $.matches = $.matches
        || $.msMatchesSelector
        || $.mozMatchesSelector
        || $.webkitMatchesSelector

    $.closest = $.closest || function(selector)
    {
        var element = this

        do if (element.matches(selector)) return element
        while (element = element.parentElement)

        return null
    }
})()