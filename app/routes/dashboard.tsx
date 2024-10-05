import React, { useState } from 'react'

import "~/styles/styles.css";
import "~/styles/dashboard.css";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
const dashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="bg-back h-100vh">
            <Header setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen} />
            <div className="main">
                <Sidebar sidebarOpen={sidebarOpen} />
                <div className="main-body">
                    <div className="box shadow-sm">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Illum in ratione qui perferendis voluptas veritatis eaque officiis dolorem, accusantium molestias suscipit ducimus laudantium iusto quo vel nemo ad ipsam. Ipsa?</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default dashboard