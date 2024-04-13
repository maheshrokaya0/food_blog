import { pb } from '$lib/pocketbase';

export async function load({ params }){
    
    const categoryId = params.slug;
    const posts = await pb.collection('posts').getList(1, 50, {
        filter: `Published = True && category = '${categoryId}'`,
        expand: "category"
    });

    const categoryInfo = await pb.collection('categories').getOne(categoryId);
    console.log(categoryInfo)
    const sub_categories = await pb.collection('categories').getList(1, 50, {
        filter: `parent_category = '${categoryId}'`
    })

    let sub_posts = [];

    for(let i=0; i<sub_categories.totalItems; i++) {
        let new_posts = await pb.collection('posts').getList(1, 6, {
            filter: `Published = True && category = '${sub_categories.items[i].id}'`
        })
        sub_posts = [...sub_posts, { category: sub_categories.items[i].category, id: sub_categories.items[i].id, new_posts}]
    }
    
    return {
        posts : posts.items,
        sub_posts : sub_posts,
        categoryInfo: categoryInfo
    }
}