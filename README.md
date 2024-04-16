# Outlook Add-in Installation and Deployment Guide

## How to Install Outlook Add-in Locally

Follow these simple steps to install the Outlook add-in locally:

1. **Clone or Download the Code**: Begin by cloning or downloading the add-in code from the repository.

2. **Open in Visual Studio Code**: Launch Visual Studio Code and open the downloaded code within it.

3. **Ensure Office Applications (Outlook) are Installed**: Make sure you have the necessary Office applications, particularly Outlook, installed on your system.

4. **Install Node.js if not Installed**: If Node.js is not already installed on your machine, ensure to install it.

5. **Open Terminal in Visual Studio Code**: Within Visual Studio Code, open the terminal.

6. **Install Node Modules**: Run the command `npm i` in the terminal to install the required node_modules.

7. **Start the Add-in**: To start the add-in, run the command `npm start` in the terminal. When prompted, select `No` for "Allow localhost loopback for Microsoft Edge WebView".

8. **Access Outlook**: The add-in will open in Outlook along with a new terminal window.

## How to Deploy the Outlook Add-in on a Server

To deploy the Outlook add-in on a server, follow these steps:

1. **Connect with Hosting Server**: Attach the GitHub repository with your hosting server, such as Heroku, Vercel, etc., or manually upload the code.

2. **Test on Browser**: Once deployed, copy the path of the server and test it on a browser using the URL `https://YOUR_DOMAIN/taskpane.html`.

3. **Replace Localhost URLs**: Open the `manifest.xml` file and replace all localhost URLs with your server's URLs.

4. **Installation Options**:

   - **Manual Installation**: Install the add-in's online version manually in your Outlook.
   - **Organization Use**: If you intend to use it within your organization, publish the manifest on the MS 365 admin center.
   - **Public Use**: To make the add-in publicly available, publish the manifest on the App Source account.

5. **Additional Steps for Public Use**: If you're publishing the add-in for public use, additional steps like implementing Starter Screens might be necessary.

Following these steps will ensure smooth installation and deployment of your Outlook add-in, enabling seamless integration with Outlook.
 