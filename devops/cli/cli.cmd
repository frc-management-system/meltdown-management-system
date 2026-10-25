for /f "tokens=* USEBACKQ" %%F in (`git rev-parse --show-toplevel`) do (set mms_root=%%F)

pushd .
cd %mms_root%/devops/cli

:node
    node %1.mjs %2 %3 %4 %5 %6 %7 %8
    goto exit

:exit
    set mms_root=
    popd