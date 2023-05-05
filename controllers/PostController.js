import PostModel from "../modules/Post.js"
export const getAll=async (req,res)=>{
  try{
    const posts =await PostModel.find().populate('user').exec()

    res.json(posts)
  }catch(err){
    res.status(500).json({
      message:"Не удалось получить статьи"
    })
  }
}

export const getOne = async (req,res)=>{
  try{
    const postId=req.params.id

    PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      }
    ).populate('user')
      .then((doc) => {
        res.json(doc);
      })
      .catch((err) => {
        console.log(err);
        res.status(404).json({ message: 'Статья не найдена' });
      });
  }catch(err){
    res.status(500).json({
      message:"Не удалось получить статью"
    })
  }
}

export const create= async (req,res)=>{
    try{
const doc=new PostModel({
    title:req.body.title,
    text:req.body.text,
    imageUrl:req.body.imageUrl,
    tags:req.body.tags.split(',') ,
    user:req.userId,
})
const post = await doc.save()

res.json(post)
    }catch(err){
        console.log(err);
          res.status(500).json({
            message:"Не удалось создать статью",
          })
       }
}
export const remove = async (req,res)=>{
  try{
    const postId=req.params.id
    PostModel.findOneAndDelete({
      _id:postId,
    }).then(() => {
      res.json({
        success:true
      });
    })
  }catch(err){
    res.status(500).json({
      message:"Не удалось удалить статью"
    })
  }
}
export const patch = async (req,res)=>{
  try{
    const postId=req.params.id
   await PostModel.updateOne({
      _id:postId,
    },{
    title:req.body.title,
    text:req.body.text,
    imageUrl:req.body.imageUrl,
    tags:req.body.tags.tags.split(','),
    user:req.userId,
    }).then(() => {
      res.json({
        success:true
      });
    })
  }catch(err){
    res.status(500).json({
      message:"Не удалось обновить статью"
    })
  }
}
export const getLastTags=async (req,res)=>{
  try{
    const posts =await PostModel.find().limit(5).exec()
    const tags=posts.map(obj=>obj.tags).flat().slice(0,5)
    res.json(tags)
  }catch(err){
    res.status(500).json({
      message:"Не удалось получить статьи"
    })
  }
}