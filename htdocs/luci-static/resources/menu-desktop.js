'use strict';
'require baseclass';
'require ui';
'require rpc';
'require uci';
'require network';

return baseclass.extend({
	__init__: function() {
		ui.menu.load().then(L.bind(this.render, this));
	},

	render: function(tree) {
		var node = tree,
			url = '';

		this.renderMainMenu(node, url);
	},

	renderMainMenu: function(tree, url) {
		var mainMenu = document.getElementById('mainmenu');
		if (!mainMenu) return;

		var menuUl = this.renderMenuLevel(tree, url, 1);
		menuUl.className = 'l1';
		mainMenu.innerHTML = '';
		mainMenu.appendChild(menuUl);
		mainMenu.style.display = '';

		this.setActiveItems(mainMenu);
	},

	renderMenuLevel: function(tree, parentUrl, level) {
		var ul = document.createElement('ul');
		ul.className = 'l' + level;

		var children = [];
		for (var k in tree.children) {
			if (tree.children.hasOwnProperty(k)) {
				children.push({
					name: k,
					node: tree.children[k],
					order: tree.children[k].order || 0
				});
			}
		}

		children.sort(function(a, b) {
			return a.order - b.order;
		});

		for (var i = 0; i < children.length; i++) {
			var child = children[i];
			var name = child.name;
			var node = child.node;
			/* Dispatch URL path (e.g. admin/status/overview). NOT node.action.path — that is often a
			 * view/template id (e.g. admin_status/index) and breaks L.url() into /cgi-bin/luci/admin_status/index */
			var myUrl = parentUrl ? parentUrl + '/' + name : name;

			if (name === 'logout') continue;

			var li = document.createElement('li');
			li.className = 'slide';

			var a = document.createElement('a');
			a.className = 'menu-link';

			if (node.action && node.action.path) {
				a.href = L.url(myUrl);
			} else if (node.children) {
				var firstChild = this.getFirstChildUrl(node, myUrl);
				a.href = firstChild || '#';
			} else {
				a.href = '#';
			}

			var textSpan = document.createElement('span');
			textSpan.className = 'menu-text';
			textSpan.textContent = node.title || name;
			a.appendChild(textSpan);

			li.appendChild(a);

			if (node.children && Object.keys(node.children).length > 0 && level < 3) {
				var subUl = this.renderMenuLevel(node, myUrl, level + 1);
				if (subUl.children.length > 0) {
					li.appendChild(subUl);
				}
			}

			ul.appendChild(li);
		}

		return ul;
	},

	getFirstChildUrl: function(node, pathPrefix) {
		if (node.action && node.action.path) {
			return L.url(pathPrefix);
		}

		if (node.children) {
			var children = [];
			for (var k in node.children) {
				children.push({
					name: k,
					node: node.children[k],
					order: node.children[k].order || 0
				});
			}
			children.sort(function(a, b) { return a.order - b.order; });

			for (var i = 0; i < children.length; i++) {
				var cn = children[i].name;
				var cp = pathPrefix ? pathPrefix + '/' + cn : cn;
				var url = this.getFirstChildUrl(children[i].node, cp);
				if (url) return url;
			}
		}

		return null;
	},

	setActiveItems: function(menu) {
		var currentPath = window.location.pathname;
		var links = menu.querySelectorAll('a.menu-link');
		var bestMatch = null;
		var bestLen = 0;

		links.forEach(function(link) {
			var href = link.getAttribute('href') || '';
			if (href !== '#' && currentPath.indexOf(href) === 0 && href.length > bestLen) {
				bestMatch = link;
				bestLen = href.length;
			}
		});

		if (bestMatch) {
			var li = bestMatch.closest('li');
			if (li) {
				li.classList.add('active');
				var parentLi = li.parentElement.closest('li');
				if (parentLi) {
					parentLi.classList.add('active', 'open');
				}
			}
		}
	}
});
