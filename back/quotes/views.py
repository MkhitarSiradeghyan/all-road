from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import QuoteSerializer

@api_view(['POST'])
def submit_quote(request):
    serializer = QuoteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'success': True}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)