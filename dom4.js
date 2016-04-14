(function(global)
{
  'use strict'

  var document = global.document

  function replaceStrings($node)
  {
    return (typeof $node == 'string') ? document.createTextNode($node) : $node
  }

  function prepareNodes($nodes)
  {
    if ($nodes.length == 1)
      return replaceStrings($nodes[0])

    return [ ].reduce.call($nodes, function($fragment, $node)
    {
      $fragment.appendChild(replaceStrings($node))
      return $fragment
    }, document.createDocumentFragment())
  }

  function query(selector)
  {
    var $that = this
    if (Array.isArray($that)) $that = $that[0]
    return ($that instanceof Document) ?
           Document.prototype.querySelector.call($that, selector) :
           Element.prototype.querySelector.call($that, selector)
  }

  function queryAll(selector)
  {
    var $elements

    if (this instanceof Elements)
    {
      $elements = Object.create(this.prototype)
      this.forEach(function($element)
      {
        var found = $element.querySelectorAll(selector)
        if (found.length)
        {
          [].forEach.call(found, function($element)
          {
            $elements.push($element)
          })
        }
      })
    }
    else
    {
      $elements = Object.create(Elements.prototype);

      [].forEach.call(this.querySelectorAll(selector), function($element)
      {
        $elements.push($element)
      })
    }

    return $elements
  }

  function implement($Interface$, objects)
  {
    objects.forEach(function(object)
    {
      var $ObjectProto$ = global[object].prototype

      var methods = Object.keys($Interface$).filter(function(key)
      {
        return typeof $ObjectProto$[key] != 'function'
      })

      var __unscoped =
        typeof Symbol == 'function'
            && Symbol.unscopables

      if (__unscoped)
      {
        var unscopables = methods.reduce(function(unscopables, method)
                                     {
                                        unscopables[method] = true
                                        return unscopables
                                     }, {})

        if (__unscoped in $ObjectProto$)
          Object.assign($ObjectProto$[__unscoped], unscopables)
        else
          $ObjectProto$[__unscoped] = unscopables
      }

      methods.forEach(function(method)
      {
          Object.defineProperty($ObjectProto$
                               , method
                               , {
                                    value: $Interface$[method],
                                    configurable: true,
                                    writable: true
                                 })
      })
    })
  }





  var $ParentNode$ =
  {
    prepend: function()
    {
      this.insertBefore(prepareNodes(arguments), this.firstChild)
    },
    append: function()
    {
      this.appendChild(prepareNodes(arguments))
    },
    query: query,
    queryAll: queryAll
  }
  var ParentNodeHeirs = ['Document', 'DocumentFragment', 'Element']
  implement($ParentNode$, ParentNodeHeirs)


  var $ChildNode$ =
  {
    before: function()
    {
      var parent = this.parentNode
      if (parent)
        parent.insertBefore(prepareNodes(arguments), this)
    },
    after: function()
    {
      var parent = this.parentNode
      if (parent)
        parent.insertBefore(prepareNodes(arguments), this.nextSibling)
    },
    replaceWith: function()
    {
      var parent = this.parentNode
      if (parent)
        parent.replaceChild(prepareNodes(arguments), this)
    },
    remove: function()
    {
      var parent = this.parentNode
      if (parent)
        parent.removeChild(this)
    }
  }
  var ChildNodeHeirs = ['DocumentType', 'Element', 'CharacterData']
  implement($ChildNode$, ChildNodeHeirs)





  function Elements()
  {
    var array = Object.create(Elements.prototype)
    array.length = arguments.length

    for (var i = 0; i < arguments.length; i++)
      array[i] = arguments[i]

    return array
  }

  if (typeof Object.setProtypeOf == 'function')
    Object.setPrototypeOf(Elements, Array)

  Elements.prototype = Object.create(Array.prototype)

  Object.defineProperties(Elements.prototype,
                                    {
                                      constructor:
                                      {
                                        value: Elements,
                                        writable: true,
                                        configurable: true
                                      },
                                      query:
                                      {
                                        value: query,
                                        writable: true,
                                        configurable: true
                                      },
                                      queryAll:
                                      {
                                        value: queryAll,
                                        writable: true,
                                        configurable: true
                                      }
                                    })

})(this)