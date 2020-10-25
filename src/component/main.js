import React , {useState, useEffect} from 'react';
import Dexie from "dexie";

const Main = () => {
    
    const db = new Dexie("LocalGallery");
    db.version(1).stores({
        posts: "title, content, file, name, size, type, width, height, form"
    })
    db.open().catch((err) => {
        console.log(err.stack || err)
    })
    
    const [postTitle, setTitle] = useState("");
    const [postContent, setContent] = useState("");
    const [postFile, setFile] = useState("");
    const [posts, setPosts] = useState("");
    const [postName, setName] = useState("");
    const [postSize, setSize] = useState("");
    const [postType, setType] = useState("");
    const [postWidth, setWidth] = useState("");
    const [postHeight, setHeight] = useState("");
    const [postForm, setForm] = useState("");

    const getFile = (e) => {
        console.log(e)

        let reader = new FileReader();
        reader.readAsDataURL(e[0]);
        reader.onload= (e) => {
            setFile(reader.result);
        }

        function readImageFile(cover) {
            var reader = new FileReader(); 
            reader.onload = function (e) {
                var img = new Image();      
                img.src = e.target.result;

                img.onload = function () {
                    var w = this.width;
                    var h = this.height;
                    if(w>h)
                    {
                        setForm('album');
                    }
                    else
                    {
                        if(h>w)
                        {
                            setForm('portrait');
                        }
                        else
                        {
                            setForm('square');
                        }
                    }
                    setWidth(w);
                    setHeight(h);
                }
            };
            reader.readAsDataURL(cover);
        }

        var fileName, fileSize,fileType;
        var fi = document.getElementById('cover');
        fileName = fi.files.item(0).name;
        fileSize = fi.files.item(0).size;
        fileType = fi.files.item(0).type;
        setName(fileName);
        setSize(fileSize);
        setType(fileType);
        readImageFile(fi.files.item(0)); 
    }
  
    const deletePost = async(id) => {
        console.log(id);
        db.posts.delete(id);
        let allPosts = await db.posts.toArray();
        setPosts(allPosts);
    }

    const getPostInfo = (e) => {
        e.preventDefault();
        if(postTitle !== "" && postContent !== "" && postFile !== ""){
            let post = {
                title: postTitle,
                content: postContent,
                file: postFile,
                name: postName,
                size: postSize,
                type: postType,
                width: postWidth,
                height: postHeight,
                form: postForm
            }
           
    
            db.posts.add(post).then(async() => {
                let allPosts = await db.posts.toArray();
                setPosts(allPosts);
            });
            
        }
        
        
    }

    const getPostEdit = (e) => {
        e.preventDefault();
        if(postTitle !== "" && postContent !== "" && postFile !== ""){
            let post = {
                title: postTitle,
                content: postContent,
                file: postFile,
                name: postName,
                size: postSize,
                type: postType,
                width: postWidth,
                height: postHeight,
                form: postForm
            }
    
            db.posts.update(postTitle, {content: postContent, file: postFile, name: postName, size: postSize, type: postType, width: postWidth, height: postHeight, form: postForm});
            
        }
    }

    useEffect(() => {

        const getPosts = async() => {
            let allPosts = await db.posts.toArray();
            setPosts(allPosts);
        }
        getPosts();
  
    }, [])

    let postData; 

    if(posts.length > 0) {
      
        postData = <div className="postsContainer">
                    {
                        
                        posts.map(post => {
                         
                             return <div className="post" key={post.title}>
                                        <div style={{backgroundImage: "url(" + post.file + ")" }} />
                                            <h2>{post.title}</h2>
                                            <p>{post.content}</p>
                                            <h2>Image info</h2>
                                            <p>Image name- {post.name}</p>
                                            <p>Image size - {post.size} B</p>
                                            <p>Image type - {post.type}</p>
                                            <p>Image width - {post.width}</p>
                                            <p>Image height - {post.height}</p>
                                            <p>Image form - {post.form}</p>
                                            <a class="buttonHref" download href={post.file}>Download</a>
                                            <button className="delete" onClick={() => deletePost(post.title)}>Delete</button>
                                        </div>
                        })
                    }
                   </div>
    }else{
        postData = <div className="message">
                     <p>There are no posts to show</p>
                   </div>
    }

    return (
    <React.Fragment>
        <form onSubmit={getPostInfo}>
           <div className="control">
           <label>Title</label>
            <input type="text" name="title"  onChange={e => setTitle(e.target.value)} />
           </div>
           <div className="control">
           <label>Content</label>
            <textarea name="content"  onChange={e => setContent(e.target.value)} />
           </div>
           <div className="control">
            <label htmlFor="cover" className="cover">Choose a file</label>
            <input type="file" id="cover" name="file"  onChange={e => getFile(e.target.files)} />
           </div>
            
            <input type="submit" value="Submit" />
        </form>

         <form onSubmit={getPostEdit}>
           <div className="control">
            <h2>Сhange record by specified title (the title cannot be changed, it is used as a key)</h2>
           </div>
           <div className="control">
           <label>Title</label>
            <input type="text" name="title"  onChange={e => setTitle(e.target.value)} />
           </div>
           <div className="control">
           <label>Content</label>
            <textarea name="content"  onChange={e => setContent(e.target.value)} />
           </div>
           <div className="control">
            <label htmlFor="cover" className="cover">Choose a file</label>
            <input type="file" id="cover" name="file"  onChange={e => getFile(e.target.files)} />
           </div>
            
            <button class="buttonEdit" id="edit">Сhange</button>
        </form>

        {postData}
      
    </React.Fragment>
  );
}

export default Main;