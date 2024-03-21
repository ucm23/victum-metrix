
export const CourseCard = ({
  item,
  id,
  title,
  scheduled,
  chaptersLength = 6,
  price,
  progress,
  isMe,
  category,
  onPress
}) => {
  return (
    <button onClick={() => onPress(item)}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-2 h-full" style={{ borderRadius: 12 }}>
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <img
            //fill
            //className="object-cover"
            //src={'/assets/bg.jpeg'}
            //src="https://www.bizneo.com/blog/wp-content/uploads/2019/09/people-analytics.jpg"
            //src="https://static.vecteezy.com/system/resources/previews/007/909/147/non_2x/self-assessment-evaluate-yourself-for-personal-development-or-work-improvement-concept-illustration-in-cartoon-style-vector.jpg"
            src={isMe ?
              "https://static.vecteezy.com/system/resources/previews/007/909/147/non_2x/self-assessment-evaluate-yourself-for-personal-development-or-work-improvement-concept-illustration-in-cartoon-style-vector.jpg"
              : "https://www.bizneo.com/blog/wp-content/uploads/2019/09/people-analytics.jpg"
            }
            style={{
              borderRadius: 6,
              objectFit: 'scale-down'
            }}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="text-lg font-medium group-hover:text-sky-700 transition line-clamp-2">
            {scheduled?.evaluation?.name}
          </div>
          <p className="text-xs text-muted-foreground">
            {isMe ? 'Autoevaluación' : title}<br /> {category}
          </p>
          {<div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <span>
              </span>
            </div>
          </div>}
        </div>
      </div>
    </button>
  )
}