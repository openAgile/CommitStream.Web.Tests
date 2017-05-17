for i in `seq 1 $1`;
do
`$2`&
echo "************* ================== >>>>>>>>>> HERE IS MY SEQUENCE NUMBER: $i"
done

wait;