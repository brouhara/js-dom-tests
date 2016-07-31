
function updateTodoList(todoList) {

    var li = todoList.getElementsByTagName('li');
    var numItems = li.length - 1;

    function findText(item, text, start) {
        return getItemText(item).indexOf(text, start);
    }

    function getItemText(item) {
        return item.textContent;
    }

    function beginsWith(item, text) {
        if (findText(item, text, 0) === 0) {
            return true;
        }
        return false;
    }

    function isTaskCompleted(item) {
        if (beginsWith(item, "COMPLETED") === true) {
            return true;
        }

        return false;
    }

    function isTaskUrgent(item) {
        if (beginsWith(item, "URGENT") === true) {
            return true;
        }

        return false;
    }

    for (var itemNumber = numItems; itemNumber >= 0; itemNumber--) {

        if (isTaskCompleted(li[itemNumber])) {
            todoList.removeChild(li[itemNumber]);
        } else if (isTaskUrgent(li[itemNumber])) {
            li[itemNumber].className += " important";
        }

    }
}

function createList(links) {
    var list = document.createElement('UL');

    function createLink(link) {
        var ahref = document.createElement('A');
        ahref.setAttribute('href', link.url);
        ahref.textContent = link.title;

        return ahref;
    }

    function createListItem(link) {
        var li = document.createElement('LI');
        var ahref = createLink(link);

        li.appendChild(ahref);

        return li;
    }

    function addSites(links) {

        function Site(title, url) {
            this.title = title,
            this.url = url
        };

        for (var title in links) {
            var site = new Site(title, links[title]);
            var listItem = createListItem(site);

            list.appendChild(listItem);
        }

    }

    addSites(links);

    return list;
}

function extractQuote(article) {
    var p = article.firstChild;
    var text = p.textContent;

    function getStart(text) {
        return text.search(/".*"/);
    }

    function getEnd(text) {
        return text.lastIndexOf('\"');
    }

    function getQuote(text, x, length) {
        return text.substr(x, length);
    }

    var start = getStart(text);
    var end = getEnd(text);
    var length = end - start;

    if (start > 0) {
        if (end > start) {
            var blockQuote = document.createElement('blockquote');
            blockQuote.textContent = getQuote(text, start, length + 1);
            p.remove();
            article.appendChild(blockQuote);
        }
    }
}

function createTable(data) {

    function Table() {

        var header = data.shift();
        var footer = data.pop();
        var body = data;
        
        var structure = {
            name: 'table',

            elements: {
                header: ['thead', 'tr', 'th', header ],
                body: ['tbody', 'tr', 'td', body ],
                footer: ['tfoot', 'tr', 'td', footer ]
            }
        }

        function Attributes(element) {
            var _element = element;

            this.text = _element.textContent;
            this.setText = function (value) {
                _element.textContent = value;
                return this.text;
            }

        }

        function Node(element) {
            var node = element;

            var _parent;
            var _children = [];

            function AppendTo(element) {
                _parent = element.appendChild(node);
                return _parent;
            }

            function AppendChild(element) {
                element.AppendTo(node);
                _children.push(element);

                return element;
            }

            this.parent = _parent;
            this.appendTo = AppendTo;

            this.children = _children;
            this.appendChild = AppendChild;
        }

        function Element(name) {
            var _name = name;
            console.log(name);

            var _element = document.createElement(name);
            
            var _attributes = new Attributes(_element);
            var _node = new Node(_element);

            this.element = _element;
            this.attributes = _attributes;
            this.node = _node;

            return this;
        }

        function create() {
            var table = new Element( structure.name );

            for( var element in structure.elements ) {
                var section = structure.elements[element]
                createSection( section, table );
            }

            return table;
        }

        function createSection( [ section, row, data, array ], parent) {
            // var section = appendElement( parent, section );

            appendElements( parent, [ section, row, data ], array );

            // if( typeof array[0] !== 'object') {

            //     var parent   = appendElement ( section, row);
            //     var children = appendElements ( parent, data, array );

            // } else {

            //     for( var x = 0; x < array.length; x++) {

            //         var parent   = appendElement ( section, row);
            //         var children = appendElements ( parent, data, array[x] );

            //     }

            // }

        }

        function createElement( element ) {
            return new Element( element );
        }

        function setElementText( element, value ) {
            element.attributes.setText( value );
        }

        function appendElementTo( element, parent ) {
            element.node.appendTo( parent.element );
        }

        function appendElementsFromArray( parent, element, values ) {
            values.forEach( function(value) {
                var newChild = createElement( element );
                appendElementTo( parent, newChild);
                setElementText( newChild, value );
            });
        }

        function appendElement( parent, element, values ) {
            console.log("Append Element: " + element);
            console.log( typeof values === 'object' );

            if( typeof values === 'object') {
                console.log('Appending Values Array');
                appendElementsFromArray( parent, element, values);
            } else {
                var element = createElement( element );
                appendElementTo( element, parent );
                return element;
            }
        }

        // Table, {Section, Row, Data}, array
        // Section, { Row, Data }, array
        function appendElements( parent, elements, array ) {
            console.log( 'Append Elements: ' + elements );
            console.log( 'Elements: '  + elements.length);

            // Table, Section
            if( elements.length > 2) {
                var element = elements.shift();
                var newParent = appendElement( parent, element );

                console.log('New Parent: ' + newParent.element );
                console.log('New Elements: ' +  elements );

                // Row, Data
                if( elements.length === 2 ) {

                    // data[ [1,2,3], [1,2,3] ]
                    if( array[0] === 'object' ) {
                        
                        // value[1,2,3]
                        array.forEach( function( value ) {
                            var newChild = appendElement( newParent, element, value );
                        });

                    }
                } else {
                    appendElements( newParent, elements, array );
                }

            } else {
                console.log('Append Children: ' + elements );
                var newChild = appendElement( parent, elements[0], array );
            }

            // // Row
            // array.forEach( function ( value ) {

            //     if( typeof value !== 'object') {
            //     } else {
            //         console.log('Section: ' + newParent.node.name);
            //         var newParent = appendElements( newParent, elements, value );
            //     }
            // });

            return parent;
        }

        var table = create();

        return table.element;
    }

    var table = new Table();

    console.log(table);

    return table;
}

