import UIKit
import WebKit

class ViewController: UIViewController, WKNavigationDelegate {
    
    var webView: WKWebView!
    var loadingIndicator: UIActivityIndicatorView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupWebView()
        loadWebsite()
    }
    
    func setupUI() {
        // Set background color
        view.backgroundColor = UIColor.black
        
        // Setup loading indicator
        loadingIndicator = UIActivityIndicatorView(style: .large)
        loadingIndicator.color = UIColor.systemBlue
        loadingIndicator.translatesAutoresizingMaskIntoConstraints = false
        view.addSubview(loadingIndicator)
        
        // Center the loading indicator
        NSLayoutConstraint.activate([
            loadingIndicator.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            loadingIndicator.centerYAnchor.constraint(equalTo: view.centerYAnchor)
        ])
        
        // Start loading animation
        loadingIndicator.startAnimating()
    }
    
    func setupWebView() {
        let webConfiguration = WKWebViewConfiguration()
        
        // Allow inline media playback
        webConfiguration.allowsInlineMediaPlayback = true
        webConfiguration.mediaTypesRequiringUserActionForPlayback = []
        
        // Enable JavaScript
        webConfiguration.preferences.javaScriptEnabled = true
        
        // Allow file access
        webConfiguration.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")
        webConfiguration.setValue(true, forKey: "allowUniversalAccessFromFileURLs")
        
        webView = WKWebView(frame: view.bounds, configuration: webConfiguration)
        webView.navigationDelegate = self
        webView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        webView.backgroundColor = UIColor.black
        
        // Hide initially, will show after loading
        webView.alpha = 0
        
        view.addSubview(webView)
    }
    
    func loadWebsite() {
        // Your deployed app URL
        guard let url = URL(string: "https://nexus-ai-1760745696.netlify.app") else {
            showErrorAlert(message: "Invalid URL")
            return
        }
        
        let request = URLRequest(url: url)
        webView.load(request)
    }
    
    func showErrorAlert(message: String) {
        let alert = UIAlertController(title: "Error", message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "Retry", style: .default) { _ in
            self.loadWebsite()
        })
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
        present(alert, animated: true)
    }
    
    // MARK: - WKNavigationDelegate
    
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        // Show loading indicator
        loadingIndicator.startAnimating()
        loadingIndicator.isHidden = false
        webView.alpha = 0
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // Hide loading indicator and show webview
        loadingIndicator.stopAnimating()
        loadingIndicator.isHidden = true
        
        UIView.animate(withDuration: 0.3) {
            self.webView.alpha = 1
        }
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        // Handle error
        loadingIndicator.stopAnimating()
        loadingIndicator.isHidden = true
        
        print("WebView failed to load: \(error.localizedDescription)")
        showErrorAlert(message: "Failed to load content. Please check your internet connection.")
    }
    
    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        // Handle provisional navigation error
        loadingIndicator.stopAnimating()
        loadingIndicator.isHidden = true
        
        print("WebView provisional navigation failed: \(error.localizedDescription)")
        showErrorAlert(message: "Failed to load content. Please check your internet connection.")
    }
    
    // Handle external links
    func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        
        guard let url = navigationAction.request.url else {
            decisionHandler(.cancel)
            return
        }
        
        // Allow navigation to your main domain
        if url.host == "nexus-ai-1760745696.netlify.app" {
            decisionHandler(.allow)
            return
        }
        
        // Handle external links
        if navigationAction.navigationType == .linkActivated {
            if UIApplication.shared.canOpenURL(url) {
                UIApplication.shared.open(url, options: [:], completionHandler: nil)
                decisionHandler(.cancel)
                return
            }
        }
        
        decisionHandler(.allow)
    }
}
