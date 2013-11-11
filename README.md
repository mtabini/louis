# Louis: Serve your blog from S3 in five minutes or less

Louis generates static blogs from the command line and automatically uploads them to S3. It's dead simple to use and requires very little set up.

It uses MultiMarkdown for inputting blog posts and pages, and comes with a ready-made theme (but you can also roll your own with [Mustache](http://mustache.github.io)).

## Your blog in five minutes (or less)

Here's how you get a blog going:

## 0. What you'll need

- An [Amazon Web Services](http://aws.amazon.com) account
- [Node.js](http://nodejs.org)
- A Unix-like operating system (I test on OS X)

## 1. Setup

- Go to the [S3 Console](https://console.aws.amazon.com/s3/home) and create a new bucket named after your blog's URL (e.g.: blog.example.org)
- Install Louis:

        sudo npm install -g louis
    
- Create a directory somewhere on your local machine—this is where you'll store your blog's source files. Then, `cd` into that directory and initialize your blog:

        mkdir blog.example.org
        cd blog.example.org
        louis new
        
        > Initializing directory...
        > Directory initialized. It's all yours.
        
## 2. Edit your configuration and create your first post

Look at the `config.yaml` file and change the settings as needed. The most important settings right now are under `deploy`. Make sure that your AWS credentials are correct.

Next, move into the `posts` directory and create your first post by making a new directory that reflects its title. For example:

    cd posts
    mkdir 'Marco\'s special soufflé recipe'
    cd 'Marco\s special soufflé recipe'
    louis init
    
You can name the directory anything you want, and use any character that your operating system allows, including accented letters and Unicode characters.

Louis will automatically attempt to guess a title and URL (called a _slug_) for your site; you can edit them in the `meta.yaml` file.

You can now use your favourite text editor to type something into `document.md`. You can use [MultiMarkdown](http://en.wikipedia.org/wiki/MultiMarkdown) syntax, including images and footnotes.

## 3. Publish your blog

When you're done, you can publish your blog to S3 with a single command:

    louis publish
    
Louis will automatically compile your files, upload them to S3 and even enable your bucket for public read-only access as a static Website.

When the process is complete, Louis tells you the final URL of your website:

    Analyzing...
      - Analyzing post archive...
      - Analyzing the index page...
      - Analyzing RSS feed...

    All documents are up to date.


    Deploying website...

    - Analyzing directory structures...
    - Enabling website...
    - Making website accessible...
    - Deleting stale files...
    - Syncing files...

    *** -> Your site should now be accessible at http://blog.example.com.s3-website-us-east-1.amazonaws.com

    Deployment complete.
    
## More information

Louis is very new, so bugs are likely—and patches are welcome. It is also capable of much more than what is shown here—I just haven't had time for proper docs yet. Try `louis --help` for some ideas.
