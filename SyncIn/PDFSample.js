/*
ADOBE SYSTEMS INCORPORATED
 Copyright 2007 Adobe Systems Incorporated
 All Rights Reserved.
 
NOTICE:  Adobe permits you to use, modify, and distribute this file in accordance with the 
terms of the Adobe license agreement accompanying it.  If you have received this file from a 
source other than Adobe, then your use, modification, or distribution of it requires the prior 
written permission of Adobe.

*/

/**
*	Class PDFSample
*	
*/
function PDFSample(){
	this.init();
}


PDFSample.prototype= {
	
	
	elements: {},	//every element needed will be stored in this table var
	
	/*
	*	Initialization 
	*/
	init:function(){
		var self = this;
		this.fillElements();
		//this.addListeners();

		//initializing products list
		this.testcaseList = new TestCaseList(this);
		this.testcaseList.addRefreshEventListener(function(){ self.refreshTestCaseList(); });		
		this.testcaseList.load();

		//initialize cart
		//this.cart = new Cart(this);
		//this.cart.addRefreshEventListener(function(ev){ self.refreshCart(ev); });		


	
	},
	
	/*
	 * Get all elements needed and fill this.elements table
	 */
	fillElements: function(){
		//products
		this.elements.products = document.getElementById('testcases');
		this.elements.testcaseList = document.getElementById('testcaseList');
		
		//clear design data
		this.elements.testcaseList.innerHTML = '';
		
		//cart
		//this.elements.cart = document.getElementById('cart');		
		//this.elements.cartList = document.getElementById('cartList');				
		//this.elements.checkout = document.getElementById('checkout');		
		//this.elements.total = document.getElementById('total');		
		//this.elements.totalPrice = document.getElementById('totalPrice');
	},
	
	 /**
	 * Attach event listeners
	 
	addListeners: function(){
		var self=this;
		this.elements.checkout.addEventListener('click', function(){ self.checkout_click()  });
	},
	*/
	refreshTestCaseList: function(){
		this.elements.testcaseList.innerHTML = '';
		var items = this.testcaseList.items;
		var even = true;
		for(id in items){
			var item = items[id];

			var listItem = document.createElement('li');
			for(var attr in item){
				if(attr=='id' || attr==='name') continue;
				var listAttribute = document.createElement('span');
				listAttribute.className = attr;
				listAttribute.innerHTML = item[attr];
				listItem.appendChild(listAttribute);
			}
			if(even) listItem.className = 'even';			
			listItem.appendChild(this.createTestButton(item));
						
			this.elements.testcaseList.appendChild(listItem);
			even^=true;
		}
	},
	
	createTestButton: function(item){
		var self = this;
		var	testButton = document.createElement('input');
		testButton.className = 'submit primary';
		testButton.type = "submit";
		testButton.value = "Print";
		testButton.addEventListener( 'click', function(){ self.test(item); });
		return testButton;
	},
	
	test: function(item){
        air.Introspector.Console.log(item);
        switch (item.name){
                case 'printairhtml':
                this.pdf = new PDFObject(); 
                this.pdf.printAirHtml();
                break;
                case 'printairpdfremote':
                this.pdf = new PDFObject();
                this.pdf.printAirPdfRemote();
                break;
                case 'printairpdflocal':
                this.pdf = new PDFObject();
                this.pdf.printAirPdfLocal();
                break;
                case 'printairpdflocaljsinjected':
                this.pdf = new PDFObject();
                this.pdf.printAirPdfLocalJSInjected();
                break;
                case 'savepdftofolder':
                this.saveToFolder();
                break;
                case 'savepdftofoldersilent':
                this.saveToFolderSilent();
                break;
              
        }
	}, 
    
	saveToFolder: function(){
        var urlrequest= new air.URLRequest("http://www.wlf.louisiana.gov/sites/default/files/pdf/pageboating/32448-boat-title-and-registration/boat.pdf");
        var stream = new air.URLStream();
        stream.addEventListener('complete',function(){
           
            var data = new air.ByteArray();
            stream.readBytes(data,0,stream.bytesAvailable);
            
            var index = urlrequest.url.lastIndexOf("/") +1;
            var filename = urlrequest.url.substring(index);
            var directory = air.File.documentsDirectory;
            try
            {
                directory.browseForSave("Save As");
                directory.addEventListener(air.Event.SELECT, function(event)
                {
                    var newFile = event.target ;
                    if (!newFile.exists)
                    {
                     var wstream = new air.FileStream();
                     wstream.open(newFile, air.FileMode.WRITE);
                     wstream.writeBytes(data,0,data.length);
                     wstream.close();
                    }
                });
            }
                                catch (error)
                                {
                 air.trace("Failed:", error.message)
                 }

        });
        stream.load(urlrequest);
    },
    
    saveToFolderSilent: function(){
        var urlrequest= new air.URLRequest("http://www.wlf.louisiana.gov/sites/default/files/pdf/pageboating/32448-boat-title-and-registration/boat.pdf");
        var stream = new air.URLStream();
        stream.addEventListener('complete',function(){
            var data = new air.ByteArray();
            stream.readBytes(data,0,stream.bytesAvailable);
            
            var index = urlrequest.url.lastIndexOf("/") +1;
            var filename = urlrequest.url.substring(index);
            air.Introspector.Console.log(filename);
            var directory = air.File.documentsDirectory;
            var file = directory.resolvePath(filename);
            var wstream = new air.FileStream();
            wstream.open(file, air.FileMode.WRITE);
              wstream.writeBytes(data,0,data.length);
            wstream.close();
           
        });
        stream.load(urlrequest);
    },
	
	createRemoveButton: function(cartItem){
		var self = this;
		var	removeButton = document.createElement('input');
		removeButton.className = 'remove';
		removeButton.type = "button";
		removeButton.value = "Remove";
		removeButton.addEventListener( 'click', function(){ self.cart.addItem(cartItem.item , -1) });
		return removeButton;
	},
	
	refreshCart: function(ev){
		var cartItem = ev.item;

		switch(ev.type){
			case 'add':
				var listItem = document.createElement('li');
				
				for(var attr in cartItem.item){
					if(attr=='id'||attr=='description') continue;
					var listAttribute = document.createElement('span');
					listAttribute.className = attr;
					listAttribute.innerHTML = cartItem.item[attr];
					listItem.appendChild(listAttribute);
				}
				
				var countItem = document.createElement('span');
				countItem.className = 'count';
				countItem.innerHTML = cartItem.count;
				listItem.appendChild(countItem);
				
				listItem.appendChild(this.createRemoveButton(cartItem));

				this.elements.cartList.appendChild(listItem);
				
				ev.item.tag = { listItem: listItem, countItem: countItem };
					
			break;
			case 'update':
				cartItem.tag.countItem.innerHTML = cartItem.count;			
			break;
			case 'remove':
				this.elements.cartList.removeChild(cartItem.tag.listItem);
			break;
		}
		
		this.elements.totalPrice.innerHTML = this.cart.getTotal();
		if(this.pdf&&this.pdf.isVisible()){
			this.pdf.refreshCart(ev);
		}
	},
	
	
	//event listeners
	checkout_click: function(){
		var ok = false;
		for(var i in this.cart.items) { ok=true; break; }
		if(this.pdf&&this.pdf.isVisible()){
//			this.pdf.show();
		}else{
			this.pdf = new PDFObject(); 
			this.pdf.prepareOrder(this.cart);
		}
	}
	
};


/*
*	Class ProductList
*	
*/
function TestCaseList(){

}

TestCaseList.prototype = {
	//listeners for the refresh event
	refreshEventListeners: [],
	
	//items table
	items: {},
	/*
	*	Retrieve and parse the XML product list from products.xml
	*/
	load: function(){
		var self = this;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){ self.xhrCallback(xhr); };
		xhr.open("GET", "products.xml", true);
		xhr.send();
	},
	
	/*
	*	XHR onreadystatechange callback from this.load function
	*/
	xhrCallback: function(xhr){
		if(xhr.readyState==4)
			if(xhr.status==200){
				//ok
				try{
					var items = {};
					var elements = xhr.responseXML.getElementsByTagName("item");
					for(var l=elements.length-1;l>=0;l--){
						var element = elements[l];
						var item = {
							id: element.getElementsByTagName('id')[0].textContent,
							title: element.getElementsByTagName('title')[0].textContent,
							description: element.getElementsByTagName('description')[0].textContent,
                            name: element.getElementsByTagName('name')[0].textContent
						};
						items[item.id] = item;

					}
					this.items = items;
					this.dispatchRefreshEvent();
				}catch(e){
					alert('Parsing error in "products.xml".');
                    air.Introspector.Console.log(e);
				}
			}else{
				//error
				alert('File "products.xml" is missing. Products list can not be loaded.');
			}
	},
	
	/*
	*	Make the application refresh cart list
	*/
	dispatchRefreshEvent: function(){
		for(var i=this.refreshEventListeners.length-1;i>=0;i--){
			if(typeof this.refreshEventListeners[i]=='function'){
				this.refreshEventListeners[i].call(this, {target:this});
			}
		}
	},
	
	/*
	*	Add a listener to refresh event
	*/
	addRefreshEventListener: function(listener){
		this.refreshEventListeners.push(listener);
	}
	
}

/**
*	Class Cart
*	
*/
function Cart(){

}

Cart.prototype = {
	//listeners for the refresh event
	refreshEventListeners: [],
	
	items: {},
	/**
	*	Add an item to the cart
	*/
	addItem: function (item, count)
	{
		if(typeof count=='undefined') count = 1;
		var ev = { type:null, item:this }
		if(typeof this.items[item.id]!='undefined'){
			this.items[item.id].count+=count;	//just incremenet count
			if(this.items[item.id].count<=0){ 	//remove it when <=0
				ev.type='remove';
				ev.item = this.items[item.id];
				delete this.items[item.id];
			}else{
				ev.type='update';
				ev.item = this.items[item.id];
			}
		}else if(count>0){
			this.items[item.id] = { 
					item: item, 
					count: count, 
					tag: null
			};
			ev.type='add';
			ev.item = this.items[item.id];
		}
		this.dispatchRefreshEvent(ev);
	},
	
	/*
	*	Fully remove an item from cart
	*/
	removeItem: function (item){
		if(typeof this.items[item.id]!='undefined'){
			ev = {type: 'remove', item: this.items[item.id]};
			delete this.items[item.id];
			this.dispatchRefreshEvent(ev);			
		}
	},
	
	getTotal: function(){
		var total = 0;
		for(l in this.items){
			total+=this.items[l].count * this.items[l].item.price;
		}
		return total;
	},
	
	/*
	*	Make the application refresh cart list
	*/
	dispatchRefreshEvent: function(ev){
		if(typeof ev!='undefined'){ 
			ev.target= this; 
		}else{
			ev = { target: this };
		}
		for(var i=this.refreshEventListeners.length-1;i>=0;i--){
			if(typeof this.refreshEventListeners[i]=='function'){
				this.refreshEventListeners[i].call(this, ev);
			}
		}
	},
	
	/**
	*	Adds a listener to the refresh event
	*/
	addRefreshEventListener: function(listener){
		this.refreshEventListeners.push(listener);
	}
}

/**
*	Class PDFObject
*	This is the most important class in this sample. 
*	
*	What does it do? 
*		1. creates a new window with an embed tag inside which points to order.pdf file. 
*		2. registers a message handler on that object
*		3. 			 an error handler 
*		4. listens for loaded event from pdf object (sent by javascript from pdf)
*		5. after loaded is fired sends all the items to pdf in order to render them
*		6. syncs items - when updated in Pdf updates them in html and when updated in 
*						html updates them in Pdf.
*	
*/

function PDFObject(){
}

PDFObject.prototype = {
	loaded:false,

	/**
	*	function prepareOrder
	*	Displays the pdf and adds items from cart
	*/
	prepareOrder: function(cart){
		this.cart = cart;
		var items = cart.items;
		this.loader = air.HTMLLoader.createRootWindow(true);
		var self = this;
		//waiting to have the pdf loaded
		this.loader.addEventListener('complete', function(){
			self.loader.removeEventListener('complete', arguments.callee);
			try{
				self.pdf = self.loader.window.document.getElementsByTagName('embed')[0];						
				//waiting for the load event from PDF. This lets us know that the javascript
				//inside the pdf is ready to listen for our demands.
				self.registerHandlers(function(){
						//generate the message and send it to pdf
						//we serialize our object (you can choose your own method 
						//											of serialization)
						// order[0] = 'report' - this is the command
						// order[1] = 'Order' 
						// order[2] = item[0].id 
						// order[2+1] = item[1].title
						// order[2+2] = item[1].count
						// order[2+3] = item[1].price 
						// ...
						var order = [];
						order.push('report');
						order.push('Order');
						for(var i in items){
							//Concat it with empty string to make sure they are strings
							//PDF accepts only strings
							order.push(items[i].item.id+'');
							order.push(items[i].item.title+'');
							order.push(items[i].count+'');
							order.push(items[i].item.price+'');
						}
						//send it to PDF
						self.postMessage(order);
                        
					});
			}catch(e){
				runtime.trace(e);
//				air.error(e);
			}
		});
		
		this.loader.load(new air.URLRequest('app:/PDFSample.html'));
	},
    
    printAirHtml: function(){

		this.loader = air.HTMLLoader.createRootWindow(false);
		var self = this;
		//waiting to have the pdf loaded
		this.loader.addEventListener('complete', function(){
            air.Introspector.Console.log('complete');
			self.loader.removeEventListener('complete', arguments.callee);
			try{
				self.pdf = self.loader.window.document.getElementsByTagName('embed')[0];
                air.Introspector.Console.log('pjob');
			    var pjob = new self.loader.window.runtime.flash.printing.PrintJob;
                if(pjob.start()){
                      var poptions = new self.loader.window.runtime.flash.printing.PrintJobOptions;
                      poptions.printAsBitmap = true;
                      pjob.addPage(self.loader, null, poptions);
                      pjob.send();
                }
			}catch(e){
				runtime.trace(e);
//				air.error(e);
			}
		});
		
		this.loader.load(new air.URLRequest('app:/PDFSample1.html'));
	},
    
    printAirPdfRemote: function(){

		this.loader = air.HTMLLoader.createRootWindow(true);
		var self = this;
		//waiting to have the pdf loaded
		this.loader.addEventListener('complete', function(){
            air.Introspector.Console.log('complete');
			self.loader.removeEventListener('complete', arguments.callee);
			try{
				self.pdf = self.loader.window.document.getElementById('OBJPdf');
                air.Introspector.Console.log(self.pdf);
                self.pdf.addEventListener('load',function(){
                //$(self.pdf).load(function(){
                air.Introspector.Console.log('pjob');
			    var pjob = new self.loader.window.runtime.flash.printing.PrintJob;
                if(pjob.start()){
                      var poptions = new self.loader.window.runtime.flash.printing.PrintJobOptions;
                      poptions.printAsBitmap = true;
                      pjob.addPage(self.loader, null, poptions);
                      pjob.send();
                }
                });
			}catch(e){
				runtime.trace(e);
//				air.error(e);
			}
		});
		
		this.loader.load(new air.URLRequest('app:/PDFSample2.html'));
	},
    
    printAirPdfLocal: function(){

		this.loader = air.HTMLLoader.createRootWindow(true);
		var self = this;
		//waiting to have the pdf loaded
		this.loader.addEventListener('complete', function(){
            air.Introspector.Console.log('complete');
			self.loader.removeEventListener('complete', arguments.callee);
			try{
				self.pdf = self.loader.window.document.getElementById('OBJPdf');
                air.Introspector.Console.log(self.pdf);
                //self.pdf.addEventListener(load,function(){
                //$(self.pdf).load(function(){
                air.Introspector.Console.log('pjob');
			    var pjob = new self.loader.window.runtime.flash.printing.PrintJob;
                if(pjob.start()){
                      var poptions = new self.loader.window.runtime.flash.printing.PrintJobOptions;
                      poptions.printAsBitmap = true;
                      pjob.addPage(self.loader, null, poptions);
                      pjob.send();
                }
               // });
			}catch(e){
				runtime.trace(e);
//				air.error(e);
			}
		});
		
		this.loader.load(new air.URLRequest('app:/PDFSample3.html'));
	},
    
    printAirPdfLocalJSInjected: function(){

		this.loader = air.HTMLLoader.createRootWindow(true);
		var self = this;
		//waiting to have the pdf loaded
		this.loader.addEventListener('complete', function(){
            air.Introspector.Console.log('complete');
			self.loader.removeEventListener('complete', arguments.callee);
			try{
				self.pdf = self.loader.window.document.getElementById('OBJPdf');
                air.Introspector.Console.log(self.pdf);
                self.registerHandlers(function(){
                    var message = [];
                    message[0] = 'print';
						//send it to PDF
				    self.postMessage(message);
                        
				});

			}catch(e){
				runtime.trace(e);
//				air.error(e);
			}
		});
		
		this.loader.load(new air.URLRequest('app:/PDFSample4.html'));
	},
	
	/**
	*	function postMessage
	*	Sends a message to PDF.
	*/
	postMessage: function(msg){
		//Keep in mind that msg should be an array of strings.
		this.pdf.postMessage(msg);
	},
	
	registerHandlers: function(loadedCallback){
		var self = this;
		//PDF is the embed tag
		//messageHandler should expose two functions: onMessage and onError
		
		this.pdf.messageHandler = {
			onMessage: function (msg) {
				//msg is always an array of strings
				//msg[0] will be the command
				switch(msg[0]){
					case 'write':
						runtime.trace(msg[1]);
					break;
					case 'loaded':
						//now we are sure that pdf listens our commands
						self.setLoaded();
						if(loadedCallback)
						 	loadedCallback();
					break;
					case 'refresh':
						switch(msg[1]){
							case 'remove':
								var id = msg[2];
								self.cart.removeItem({id: id });
							break;
							case 'update':
								var id = msg[2];
								var count = parseFloat(msg[3]);
								self.cart.addItem( {id: id}, count);
							break;
						}
					break;
				}
			},

			onError: function(error, msg) {
//				air.error(error, msg);				
			}
		};
	},
	
	setLoaded: function(){
		this.loaded = true;
		//let the pdf know we are setup
		this.postMessage( ['loaded'] );
	},
	
	refreshCart: function(ev){
		var order = ['refresh', ev.type, 
				ev.item.item.id+'', 
				ev.item.item.title+'', 
				ev.item.count+'', 
				ev.item.item.price+'' ];
		this.postMessage(order);
	},
	
	isVisible: function(){ return this.loaded && !this.loader.stage.nativeWindow.closed; }
};