import { Empty } from 'antd'

const Emptiness = ({ }) => {
    return (
        <div className="text-center text-sm text-muted-foreground mt-10">
            <Empty description={<span>Sin evaluaciones</span>} />
        </div>
    )
}

export default Emptiness;
