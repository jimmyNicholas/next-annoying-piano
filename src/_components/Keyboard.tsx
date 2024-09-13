import { Key } from '@/_lib/_types/types'

export default function Keyboard({
    keys,
}: {
    keys: Key[];
}) {

    return (
        <div>
            Keyboard
            {keys.map((key) => {
                return (
                    <div key={key.name}>
                        {key.name}
                    </div>
                )
            })}
        </div>
    );
};
