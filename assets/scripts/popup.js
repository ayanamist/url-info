(function(){
	function $(id) {
		return document.getElementById(id);
	}

	chrome.tabs.getSelected(null, function(tab){
		var labels = document.getElementsByTagName('label');
		var length = labels.length;
		for (var i = 0; i < length; ++i) {
			var label = labels[i];
			var msg = chrome.i18n.getMessage(label.getAttribute('for'));
			if (msg) {
				label.innerText = msg;
			}
		}

		var copy_link = document.getElementById('copy-link');
		msg = chrome.i18n.getMessage('copy');
		if (msg) {
			copy_link.innerText = msg;
		}
		copy_link.addEventListener('mousedown', function (event) {
			document.execCommand('copy');
			this.style.color = '#fff';
			this.style.backgroundColor = 'rgba(120, 120, 120, .9)';
			event.preventDefault();
		}, false);
		copy_link.addEventListener('mouseup', function () {
			this.style.color = '#000';
			this.style.backgroundColor = 'rgba(240, 240, 240, .9)';
		}, false);

		var last_selected = null;
		var hover_on_copy = false;

		copy_link.addEventListener('mouseover', function () {
			hover_on_copy = true;
		}, false);

		copy_link.addEventListener('mouseout', function () {
			this.style.color = '#000';
			this.style.backgroundColor = 'rgba(240, 240, 240, .9)';
			hover_on_copy = false;
		}, false);

		var inputs = document.getElementsByTagName('input');
		length = inputs.length;
		for (var i = 0; i < length; ++i) {
			var input = inputs[i];
			if (input.type == 'button') {
				input.addEventListener('click', function () {
					var new_scheme = this.id;
					var new_url = new_scheme + url.substring(scheme.length);
					chrome.tabs.update(tabId, {'url': new_url});
					window.close();
				}, false);
			} else {
				input.addEventListener('mouseover', function () {
					if (hover_on_copy || this.id == last_selected) {
						return;
					}

					var self = this;
					last_selected = self.id;
					self.parentNode.appendChild(copy_link);
					copy_link.style.display = 'block';

					setTimeout(function(){
						self.select();
					}, 10);
				}, false);

				input.addEventListener('mouseout', function () {
					setTimeout(function(){
						if (hover_on_copy) {
							return;
						}
						last_selected = null;
						copy_link.style.display = 'none';
					}, 10);
				}, false);

				input.addEventListener('mousedown', function () {
					copy_link.style.display = 'none';
				}, false);

				input.addEventListener('mouseup', function () {
					copy_link.style.display = 'block';
				}, false);
			}
		}

		var tabId = tab.id;
		var url = tab.url;
		$('full_url').value = url;
		var parts = /(https?|ftp):\/\/([^/?#]+:[^/?#]+@)?(([^/?#:]+)|(\[[a-fA-F0-9:]+\]))(:([0-9]+))?((\/([^\?#]*)?)(\?([^#]*))?(#.*)?)/.exec(url);
		/*
		(https?|ftp)						scheme
		([^/?#]+:[^/?#]+@)?					userinfo
		(([^/?#:]+)|(\[[a-fA-F0-9:]+\]))	hostname
		(\[[a-fA-F0-9:]+\])					hostname (IPv6)
		(:([0-9]+))?						port
		(\/([^\?#]*)?)						path
		(\?([^#]*))?						query
		(#.*)?								fragment
		*/
		var scheme = parts[1];
		var hostname = parts[3];
		var port = parts[7];
		if (!port) {
			switch (scheme) {
				case 'http':
					port = '80'
					break;
				case 'https':
					port = '443'
					break;
				case 'ftp':
					port = '21'
			}
		}
		var remove_button = $(scheme);
		remove_button.parentNode.removeChild(remove_button);
		$('hostname').value = hostname;
		$('hostname_with_port').value = hostname + ':' + port;
		$('path').value = parts[9];
		$('full_path').value = parts[8];
		$('query').value = parts[12] || '';
		doQR($('qr_canvas'), url, 240, 240);
	});
})()
