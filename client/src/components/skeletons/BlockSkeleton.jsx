const BlockSkeleton = () => {
    const skeletonMessages = Array(7).fill(null);

    return (
        <div className="flex flex-col justify-center overflow-y-auto p-4 space-y-4">
            {skeletonMessages.map((_, idx) => (
                <div key={idx} className={`flex flex-row gap-3 items-center chat chat-start w-full`}>
                    <div className="chat-image avatar">
                        <div className="size-10 rounded-full">
                            <div className="skeleton w-full h-full rounded-full" />
                        </div>
                    </div>
                    <div className="chat-bubble-warning bg-transparent p-0">
                        <div className="skeleton h-12 w-[200px] md:w-[400px] lg:w-[600px] xl:w-[800px] transition-all ease-in-out duration-300" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BlockSkeleton;